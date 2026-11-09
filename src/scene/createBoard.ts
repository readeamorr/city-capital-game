// Babylon's modular build needs this side-effect import to register ray-based scene picking.
import '@babylonjs/core/Culling/ray';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';
import type { Property } from '../game/properties';

const districtColors: Record<Property['district'], string> = {
  harbor: '#5ca8ad', garden: '#81aa70', market: '#d39c66', innovation: '#888dc2',
};

export function createBoard(scene: Scene, properties: readonly Property[], onSelect: (property: Property) => void, shadows: ShadowGenerator) {
  function material(name: string, color: string): StandardMaterial {
    const result = new StandardMaterial(name, scene);
    result.diffuseColor = Color3.FromHexString(color);
    result.specularColor = new Color3(0.12, 0.12, 0.12);
    return result;
  }
  function block(name: string, width: number, height: number, depth: number, x: number, y: number, z: number, mat: StandardMaterial) {
    const mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    mesh.position.set(x, y, z);
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
    return mesh;
  }

  const base = material('board base', '#455c61');
  const sidewalk = material('sidewalk', '#c7c9b7');
  const road = material('road', '#526267');
  const roadMark = material('road markings', '#e7debc');
  const plaza = material('plaza', '#a8bba0');
  const tree = material('tree canopy', '#59856d');
  const trunk = material('tree trunks', '#806d5a');
  const start = material('start', '#e5ca7c');

  block('district base', 24, 0.45, 15.2, 0, 0.225, 0, base);
  block('main avenue', 23.4, 0.06, 3.2, 0, 0.48, 0, road);
  for (const z of [-2.05, 2.05]) block('avenue sidewalk', 23.4, 0.12, 0.8, 0, 0.51, z, sidewalk);
  for (let x = -9; x <= 9; x += 2) block('lane marking', 0.85, 0.015, 0.08, x, 0.52, 0, roadMark);
  // The plots line two parallel blocks; a small landscaped civic space breaks up the avenue.
  block('civic island', 4.4, 0.13, 1.25, 1.7, 0.55, 0, plaza);
  for (const x of [0.3, 3.1]) {
    const stem = MeshBuilder.CreateCylinder('tree trunk', { height: 0.6, diameter: 0.16, tessellation: 8 }, scene);
    stem.position.set(x, 0.91, 0); stem.material = trunk; stem.isPickable = false;
    const crown = MeshBuilder.CreateCylinder('tree canopy', { height: 0.9, diameter: 0.8, tessellation: 8 }, scene);
    crown.position.set(x, 1.55, 0); crown.material = tree; crown.isPickable = false;
    shadows.addShadowCaster(stem); shadows.addShadowCaster(crown);
  }
  // A distinct entrance tile, not a property or part of the property grid.
  block('start tile', 1.6, 0.16, 2.1, -10.9, 0.58, 0, start);
  const labelTexture = new DynamicTexture('start label', { width: 512, height: 256 }, scene, false);
  labelTexture.hasAlpha = true;
  labelTexture.drawText('START', null, 160, 'bold 90px sans-serif', '#304b4c', 'transparent', true);
  const labelMaterial = new StandardMaterial('start label material', scene);
  labelMaterial.diffuseTexture = labelTexture;
  labelMaterial.useAlphaFromDiffuseTexture = true;
  labelMaterial.specularColor = Color3.Black();
  const label = MeshBuilder.CreateGround('start label', { width: 1.5, height: 1.5 }, scene);
  label.position.set(-10.9, 0.675, 0); label.material = labelMaterial; label.isPickable = false;

  const propertiesById = new Map(properties.map((property) => [property.id, property]));
  let selected: StandardMaterial | undefined;
  const propertyMaterials = new Map<string, StandardMaterial>();
  const positions = new Map<string, Vector3>();
  const startPosition = new Vector3(-10.9, 1.185, 0);
  properties.forEach((property, index) => {
    const x = -8.75 + (index % 6) * 3.5;
    const z = index < 6 ? -4.9 : 4.9;
    block(`walkway-${property.id}`, 3.15, 0.1, 4.0, x, 0.52, z, sidewalk);
    const plotMaterial = material(`plot material ${property.id}`, districtColors[property.district]);
    const plot = block(`plot-${property.id}`, 2.75, 0.22, 3.5, x, 0.68, z, plotMaterial);
    plot.isPickable = true;
    plot.metadata = { propertyId: property.id };
    propertyMaterials.set(property.id, plotMaterial);
    positions.set(property.id, new Vector3(x, 1.33, z));
    // Small inset gives the empty plots some dimension without suggesting a building level.
    block(`plot inset ${property.id}`, 1.9, 0.025, 2.5, x, 0.805, z, plotMaterial);
  });

  function clearSelection() {
    if (selected) selected.emissiveColor = Color3.Black();
    selected = undefined;
  }

  function selectProperty(propertyId: string) {
    const property = propertiesById.get(propertyId);
    const plotMaterial = propertyMaterials.get(propertyId);
    if (!property || !plotMaterial) return;
    console.log('Property selected', propertyId);
    clearSelection();
    selected = plotMaterial;
    selected.emissiveColor = new Color3(0.28, 0.28, 0.17);
    onSelect(property);
  }

  scene.onPointerObservable.add((event) => {
    const mesh = event.pickInfo?.hit ? event.pickInfo.pickedMesh : null;
    const propertyId: unknown = mesh?.metadata?.propertyId;
    if (typeof propertyId === 'string') selectProperty(propertyId);
  }, PointerEventTypes.POINTERDOWN);

  return { startPosition, positions, selectProperty, clearSelection };
}
