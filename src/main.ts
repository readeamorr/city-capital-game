import { Engine } from '@babylonjs/core/Engines/engine';
import '@babylonjs/loaders/glTF';
import { createScene } from './scene/createScene';
import './styles/main.css';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
const status = document.querySelector<HTMLElement>('#status');

if (!canvas || !status) {
  throw new Error('The game canvas or status element is missing.');
}

try {
  const engine = new Engine(canvas, true);
  const scene = createScene(engine, canvas);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());
  status.textContent = 'Prototype scene loaded';
} catch (error) {
  status.textContent = 'Unable to load the prototype scene. Check that WebGL is enabled in Chrome.';
  console.error('Failed to initialize the prototype scene:', error);
}
