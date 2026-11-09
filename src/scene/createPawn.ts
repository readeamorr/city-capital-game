import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import type { Scene } from '@babylonjs/core/scene';

export function createPawn(scene: Scene, shadows: ShadowGenerator, start: Vector3) {
  const pawn = MeshBuilder.CreateCylinder('player pawn', { height: 1.05, diameterTop: 0.38, diameterBottom: 0.7, tessellation: 16 }, scene);
  pawn.position.copyFrom(start);
  pawn.isPickable = false;
  const material = new StandardMaterial('pawn material', scene);
  material.diffuseColor = Color3.FromHexString('#f4bc57');
  material.emissiveColor = new Color3(0.12, 0.06, 0.01);
  pawn.material = material;
  shadows.addShadowCaster(pawn);

  return {
    moveTo(destination: Vector3): Promise<void> {
      const origin = pawn.position.clone();
      const duration = 420;
      return new Promise((resolve) => {
        let startTime: number | undefined;
        const frame = (time: number) => {
          startTime ??= time;
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = progress * progress * (3 - 2 * progress);
          Vector3.LerpToRef(origin, destination, eased, pawn.position);
          pawn.position.y += Math.sin(progress * Math.PI) * 0.45;
          if (progress < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    },
  };
}
