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
import { createPawn } from './createPawn';

export function createScene(engine: Engine, canvas: HTMLCanvasElement) {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.55, 0.67, 0.72, 1);

  const camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 36, new Vector3(0, 0.3, 0), scene);
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
  sunlight.intensity = 1.1;
  sunlight.diffuse = new Color3(1, 0.94, 0.83);
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.75;
  ambient.groundColor = new Color3(0.36, 0.42, 0.40);

  const shadows = new ShadowGenerator(2048, sunlight);
  shadows.useBlurExponentialShadowMap = true;
  const board = createBoard(scene, properties, showProperty, shadows);
  const pawn = createPawn(scene, shadows, board.startPosition);

  return { scene, board, pawn };
}
