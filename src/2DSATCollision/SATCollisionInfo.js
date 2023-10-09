import { Vec2 } from "playcanvas";

export class SATCollisionInfo {
  shapeA = null;

  shapeB = null;

  distance = 0;

  vector = new Vec2();

  shapeAContained = false;

  shapeBContained = false;

  separation = new Vec2();
}
