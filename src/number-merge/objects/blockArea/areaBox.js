import { Entity, OrientedBox } from "playcanvas";

export class AreaBox extends Entity{
  constructor() {
    super();

    this.addComponent("model", { type: "box" });
    this.orientedBox = new OrientedBox();
  }

  config(data) {
    this.setLocalScale(data.scale);
    this.setLocalPosition(data.pos);
    this.setLocalEulerAngles(data.rot);
    this.orientedBox.worldTransform = this.getWorldTransform();
    this.enabled = false;
  }

  getBouding() {
    return this.model.meshInstances[0].aabb;
  }
}