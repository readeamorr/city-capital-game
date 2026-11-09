import { Engine } from '@babylonjs/core/Engines/engine';
import '@babylonjs/loaders/glTF';
import { createScene } from './scene/createScene';
import { properties } from './game/properties';
import { createRoute, createTurnController } from './game/turn';
import './styles/main.css';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
const status = document.querySelector<HTMLElement>('#status');

if (!canvas || !status) {
  throw new Error('The game canvas or status element is missing.');
}

try {
  const engine = new Engine(canvas, true);
  const { scene, board, pawn } = createScene(engine, canvas);
  const rollButton = document.querySelector<HTMLButtonElement>('#roll-dice');
  const diceValue = document.querySelector<HTMLElement>('#dice-value');
  const turnMessage = document.querySelector<HTMLElement>('#turn-message');
  const locationValue = document.querySelector<HTMLElement>('#location-value');
  const propertyPanel = document.querySelector<HTMLElement>('#property-panel');
  if (!rollButton || !diceValue || !turnMessage || !locationValue || !propertyPanel) {
    throw new Error('The turn controls are missing.');
  }

  const route = createRoute(properties);
  const turn = createTurnController(route, (space) => {
    const destination = space.kind === 'start' ? board.startPosition : board.positions.get(space.propertyId);
    if (!destination) throw new Error('A board position is missing.');
    return pawn.moveTo(destination);
  }, (state, space) => {
    rollButton.disabled = state.moving;
    diceValue.textContent = state.lastRoll === null ? '—' : String(state.lastRoll);
    locationValue.textContent = space.kind === 'start' ? 'START' : space.name;
    if (state.moving && state.lastRoll !== null) {
      turnMessage.textContent = `Moving ${state.lastRoll} ${state.lastRoll === 1 ? 'space' : 'spaces'}...`;
    }
  }, (space) => {
    turnMessage.textContent = `Landed on: ${space.kind === 'start' ? 'START' : space.name}`;
    if (space.kind === 'property') board.selectProperty(space.propertyId);
    else {
      board.clearSelection();
      propertyPanel.hidden = true;
    }
  });
  rollButton.addEventListener('click', () => {
    void turn.roll().catch((error: unknown) => {
      status.textContent = 'Unable to complete the move.';
      turnMessage.textContent = 'Movement interrupted. Try rolling again.';
      console.error('Turn failed:', error);
    });
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());
  status.textContent = 'Prototype scene loaded';
} catch (error) {
  status.textContent = 'Unable to load the prototype scene. Check that WebGL is enabled in Chrome.';
  console.error('Failed to initialize the prototype scene:', error);
}
