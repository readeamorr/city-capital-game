import { Color3 } from '@babylonjs/core/Maths/math.color';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';

/** Reusable, non-interactive primitive details. Property plots remain the pick targets. */
export function createCityDetails(scene: Scene, shadows: ShadowGenerator) {
  function material(name: string, hex: string) {
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = Color3.FromHexString(hex);
    mat.specularColor = new Color3(.08, .08, .08);
    return mat;
  }
  const curb = material('detail curb', '#e2d8c6');
  const dark = material('detail metal', '#3d5961');
  const leaf = material('detail foliage', '#5d9473');
  const light = material('detail lamp', '#f9df9e');
  light.emissiveColor = new Color3(.32, .23, .10);
  const stone = material('detail civic stone', '#d4c8a8');
  const roof = material('detail civic roof', '#708b8a');
  const paint = material('detail road paint', '#f0e8d4');

  function box(name: string, x: number, y: number, z: number, w: number, h: number, d: number, mat: StandardMaterial, shadow = false) {
    const mesh = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    mesh.position.set(x, y, z); mesh.material = mat; mesh.isPickable = false; mesh.receiveShadows = true;
    if (shadow) shadows.addShadowCaster(mesh);
    return mesh;
  }
  function cylinder(name: string, x: number, y: number, z: number, height: number, diameter: number, mat: StandardMaterial, shadow = false) {
    const mesh = MeshBuilder.CreateCylinder(name, { height, diameter, tessellation: 8 }, scene);
    mesh.position.set(x, y, z); mesh.material = mat; mesh.isPickable = false;
    if (shadow) shadows.addShadowCaster(mesh);
    return mesh;
  }
  function tree(x: number, z: number) {
    cylinder('tree stem', x, 1.01, z, .65, .16, dark, true);
    cylinder('tree crown', x, 1.65, z, .9, .72, leaf, true);
  }
  function lamp(x: number, z: number) {
    cylinder('street lamp post', x, 1.15, z, 1.2, .09, dark, true);
    box('street lamp arm', x, 1.76, z, .38, .09, .09, dark, true);
    box('street lamp light', x + .16, 1.71, z, .22, .13, .18, light);
  }
  // Curbs, pedestrian crossings and short cross-streets introduce a city-grid rhythm.
  for (const z of [-2.43, 2.43]) box('sidewalk edge', 0, .59, z, 23.3, .12, .10, curb);
  for (const x of [-6.95, 0, 6.95]) {
    box('intersection', x, .515, 0, .8, .02, 3.15, dark);
    for (const z of [-1.28, -.84, .84, 1.28]) box('crosswalk', x, .53, z, .65, .02, .19, paint);
    lamp(x + .55, -2.07); lamp(x - .55, 2.07);
  }
  // A compact civic landmark stays on the central median, clear of all plot centres.
  box('civic plinth', 1.7, .67, 0, 1.45, .18, 1.02, stone, true);
  box('civic hall', 1.7, 1.24, 0, 1.05, 1.0, .76, stone, true);
  for (const x of [1.38, 1.7, 2.02]) box('civic hall window', x, 1.25, -.391, .18, .44, .025, dark);
  box('civic roof', 1.7, 1.80, 0, 1.24, .15, .9, roof, true);
  box('landmark tower', 1.7, 2.07, 0, .36, .45, .36, roof, true);
  for (const x of [-3.0, 5.0]) { tree(x, 0); }
  for (const x of [-9.5, -4.2, 4.2, 9.5]) {
    for (const z of [-2.05, 2.05]) cylinder('sidewalk shrub', x, .78, z, .35, .36, leaf);
  }

  function sign(id: string, name: string, x: number, z: number) {
    // Generated locally from property data; no external fonts or image assets.
    const texture = new DynamicTexture(`sign texture ${id}`, { width: 512, height: 128 }, scene, false);
    texture.drawText(name.toUpperCase(), null, 82, 'bold 37px sans-serif', '#f7f2e7', '#334d53', true);
    const mat = new StandardMaterial(`sign material ${id}`, scene);
    mat.diffuseTexture = texture; mat.emissiveColor = new Color3(.22, .22, .22); mat.specularColor = Color3.Black();
    const plaque = MeshBuilder.CreateGround(`sign ${id}`, { width: 2.2, height: .52 }, scene);
    plaque.position.set(x, .825, z + (z < 0 ? -1.25 : 1.25));
    plaque.material = mat; plaque.isPickable = false;
  }
  return { sign };
}
