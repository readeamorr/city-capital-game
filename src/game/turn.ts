import type { Property } from './properties';

export type BoardSpace = { kind: 'start' } | { kind: 'property'; propertyId: string; name: string };

export interface TurnState {
  lastRoll: number | null;
  position: number;
  moving: boolean;
}

/** A loop: START, along one row, then back along the other row. */
export function createRoute(properties: readonly Property[]): BoardSpace[] {
  const ordered = [...properties.slice(0, 6), ...properties.slice(6).reverse()];
  return [{ kind: 'start' }, ...ordered.map((p): BoardSpace => ({ kind: 'property', propertyId: p.id, name: p.name }))];
}

/** Owns turn state only; the caller supplies animation and interface updates. */
export function createTurnController(
  route: readonly BoardSpace[],
  moveTo: (space: BoardSpace) => Promise<void>,
  onChange: (state: Readonly<TurnState>, space: BoardSpace) => void,
  onLand: (space: BoardSpace) => void,
  random: () => number = Math.random,
) {
  const state: TurnState = { lastRoll: null, position: 0, moving: false };
  const notify = () => onChange({ ...state }, route[state.position]);
  notify();
  return {
    async roll(): Promise<void> {
      if (state.moving) return;
      state.moving = true;
      state.lastRoll = Math.floor(random() * 6) + 1;
      notify();
      try {
        for (let step = 0; step < state.lastRoll; step++) {
          const next = (state.position + 1) % route.length;
          await moveTo(route[next]);
          state.position = next;
          notify();
        }
        onLand(route[state.position]);
      } finally {
        state.moving = false;
        notify();
      }
    },
  };
}
