import { Camera } from '@babylonjs/core/Cameras/camera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines/engine';
import { properties } from '../game/properties';
import { showProperty } from '../ui/propertyPanel';
import { createBoard } from './createBoard';

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.45, 0.56, 0.62, 1);

  const camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 34, Vector3.Zero(), scene);
  camera.lowerRadiusLimit = 14;
  camera.upperRadiusLimit = 50;
  camera.upperBetaLimit = Math.PI / 2.05;
  camera.attachControl(canvas, true);
  const updateCameraFov = () => {
    camera.fovMode = canvas.clientWidth < canvas.clientHeight
      ? Camera.FOVMODE_HORIZONTAL_FIXED : Camera.FOVMODE_VERTICAL_FIXED;
  };
  updateCameraFov();
  window.addEventListener('resize', updateCameraFov);
  scene.onDisposeObservable.add(() => window.removeEventListener('resize', updateCameraFov));

  const sunlight = new DirectionalLight('sunlight', new Vector3(-1, -2, -1), scene);
  sunlight.position = new Vector3(8, 16, 8);
  sunlight.intensity = 1.2;
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.65;

  const shadows = new ShadowGenerator(1024, sunlight);
  shadows.useBlurExponentialShadowMap = true;
  createBoard(scene, properties, showProperty, shadows);

  return scene;
}
