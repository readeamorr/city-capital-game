import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines/engine';

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.45, 0.56, 0.62, 1);

  const camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 18, Vector3.Zero(), scene);
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 30;
  camera.upperBetaLimit = Math.PI / 2.05;
  camera.attachControl(canvas, true);

  const sunlight = new DirectionalLight('sunlight', new Vector3(-1, -2, -1), scene);
  sunlight.position = new Vector3(8, 16, 8);
  sunlight.intensity = 1.2;
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.65;

  const ground = MeshBuilder.CreateGround('ground', { width: 14, height: 14 }, scene);
  const groundMaterial = new StandardMaterial('ground-material', scene);
  groundMaterial.diffuseColor = new Color3(0.57, 0.65, 0.61);
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  const box = MeshBuilder.CreateBox('temporary-box', { size: 2 }, scene);
  box.position.y = 1;
  const boxMaterial = new StandardMaterial('box-material', scene);
  boxMaterial.diffuseColor = new Color3(0.82, 0.76, 0.65);
  box.material = boxMaterial;

  const shadows = new ShadowGenerator(1024, sunlight);
  shadows.useBlurExponentialShadowMap = true;
  shadows.addShadowCaster(box);

  return scene;
}
