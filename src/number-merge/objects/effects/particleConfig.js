import { Curve, Vec3 } from "playcanvas";

export const ParticleConfig = {
  lifeTime: [0.5, 1],
  alignToMotion: true,
  gravity: 10,
  startSize: [new Vec3(1, 1, 1), new Vec3(2, 2, 2)],
  velocity: [new Vec3(-3, 6, -3), new Vec3(3, 8, 3)],
  alphaGraph: new Curve([0, 1, 1, 1]),
  scaleGraph: new Curve([0, 0, 0.5, 1, 1, 0]),
  emitterInnerExtents: new Vec3(0, 0, 0)
}