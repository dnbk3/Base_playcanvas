import { Entity, Vec3 } from "playcanvas";
import { Script } from "../../template/systems/script/script";
import { Circle } from "../object/Circle";
import { SATCollisionTag } from "../SATCollisionTag";

export const CircleCollider = Script.createScript({
  name: "circleCollider",

  attributes: {
    tag             : { default: SATCollisionTag.Default },
    center          : { default: new Vec3(0, 0, 0) },
    radius          : { default: 2 },
    render          : { default: false },
    IgnoreColliders : { default: [] },
    owner           : { default: null },
  },

  initialize() {
    var center = new Entity();
    center.setLocalPosition(this.center);
    this.entity.addChild(center);

    var point = new Entity();
    var pointPos = new Vec3();
    pointPos.copy(this.center);
    pointPos.x += this.radius;
    point.setLocalPosition(pointPos);
    this.entity.addChild(point);
    if (this.render) {
      center.setLocalScale(this.radius * 2, 1, this.radius * 2);
      center.addComponent("model", {
        type: "cylinder",
      });
    }
    this.circle = Circle.createCircle(center, point);
    // SATCollisionManager.instance.add(this);
  },

  onDestroy() {
    // SATCollisionManager.instance.remove(this);
  },
});
