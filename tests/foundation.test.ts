import { describe, expect, it, vi } from 'vitest';
import { NullEngine } from '@babylonjs/core/Engines/nullEngine';
import { Scene } from '@babylonjs/core/scene';
import { Ray } from '@babylonjs/core/Culling/ray';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PointerInfo, PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { properties } from '../src/game/properties';
import { createRoute, createTurnController } from '../src/game/turn';
import { createBoard } from '../src/scene/createBoard';

describe('property data', () => {
  it('has 12 unique, unowned properties with valid economics', () => {
    expect(properties).toHaveLength(12);
    expect(new Set(properties.map(p => p.id)).size).toBe(12);
    for (const p of properties) {
      expect(p.name).toBeTruthy(); expect(p.price).toBeGreaterThan(0); expect(p.baseRent).toBeGreaterThan(0);
      expect(p.owner).toBeNull(); expect(p.buildingLevel).toBe(0);
    }
  });
});

describe('turns', () => {
  it('maps every die outcome 1–6 and lands at the expected space', async () => {
    const route = createRoute(properties);
    for (let n = 1; n <= 6; n++) {
      const moves = vi.fn(async () => {}); const landing = vi.fn(); const change = vi.fn();
      const turn = createTurnController(route, moves, change, landing, () => (n - 0.5) / 6);
      await turn.roll();
      expect(change.mock.calls.at(-1)?.[0]).toMatchObject({ lastRoll: n, position: n, moving: false });
      expect(moves).toHaveBeenCalledTimes(n); expect(landing).toHaveBeenCalledWith(route[n]);
    }
  });
  it('locks rolls while moving, then wraps through START', async () => {
    const route = createRoute(properties); let release!: () => void; let first = true;
    const moves = vi.fn(async () => { if (first) { first = false; await new Promise<void>(r => { release = r; }); } });
    const change = vi.fn(); const landing = vi.fn();
    const turn = createTurnController(route, moves, change, landing, () => 0.999);
    const pending = turn.roll(); await turn.roll(); expect(moves).toHaveBeenCalledTimes(1);
    expect(change.mock.calls.at(-1)?.[0].moving).toBe(true); release(); await pending;
    await turn.roll(); await turn.roll();
    expect(change.mock.calls.at(-1)?.[0]).toMatchObject({ position: 5, moving: false });
    expect(change.mock.calls.some(([state, space]) => state.moving && state.position === 0 && space.kind === 'start')).toBe(true);
    expect(landing).toHaveBeenLastCalledWith(route[5]);
  });
});

describe('board creation and picking', () => {
  it('creates all plots, picks each property and safely ignores empty space', () => {
    const engine = new NullEngine();
    // NullEngine has no canvas or GPU texture. Stub only the START label's drawing surface.
    const context = { fillRect() {}, fillText() {}, measureText: () => ({ width: 300 }) };
    vi.spyOn(engine, 'createCanvas').mockImplementation(() => ({ width: 1, height: 1, getContext: () => context }) as unknown as HTMLCanvasElement);
    Object.assign(engine, {
      createDynamicTexture: (width: number, height: number) => ({ width, height, baseWidth: width, baseHeight: height, isReady: true, dispose() {} }),
      updateDynamicTexture: () => {},
    });
    const scene = new Scene(engine); const onSelect = vi.fn();
    const board = createBoard(scene, properties, onSelect, { addShadowCaster() {} } as unknown as ShadowGenerator);
    scene.meshes.forEach(mesh => mesh.computeWorldMatrix(true));
    expect(board.positions.size).toBe(12); expect(scene.getMeshByName('start tile')).toBeTruthy();
    for (const property of properties) {
      const pos = board.positions.get(property.id)!;
      const pick = scene.pickWithRay(new Ray(new Vector3(pos.x, 10, pos.z), new Vector3(0, -1, 0), 20))!;
      expect(pick.hit).toBe(true); expect(pick.pickedMesh?.metadata).toEqual({ propertyId: property.id });
      scene.onPointerObservable.notifyObservers(new PointerInfo(PointerEventTypes.POINTERDOWN, {} as PointerEvent, pick), PointerEventTypes.POINTERDOWN);
      expect(onSelect).toHaveBeenLastCalledWith(property);
    }
    const previous = onSelect.mock.calls.length;
    const empty = scene.pickWithRay(new Ray(new Vector3(0, 10, 30), new Vector3(0, -1, 0), 20))!;
    scene.onPointerObservable.notifyObservers(new PointerInfo(PointerEventTypes.POINTERDOWN, {} as PointerEvent, empty), PointerEventTypes.POINTERDOWN);
    expect(onSelect).toHaveBeenCalledTimes(previous);
    scene.dispose(); engine.dispose();
  });
});
