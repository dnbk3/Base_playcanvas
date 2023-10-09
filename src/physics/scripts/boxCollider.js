import { Entity, OrientedBox, Vec3 } from "playcanvas";
import { Script } from "../../template/systems/script/script";
import { CollisionDetector } from "../collisionDetector";
import { CollisionTag } from "../collisionTag";

export const BoxCollider = Script.createScript({
  name: "boxCollider",

  attributes: {
    tag      : { default: CollisionTag.Default },
    position : { default: new Vec3() },
    scale    : { default: new Vec3(1, 1, 1) },
    render: { default: false },
    IgnoreColliders: { default: [] },
    owner: { default: null },
  },

  initialize() {
    this.owner = this.owner ? this.owner : this.entity;
    this.box = new Entity("box");
    this.box.addComponent("model", { type: "box" });
    this.box.setLocalPosition(this.position);
    this.box.setLocalScale(this.scale);
    this.box.enabled = this.render;
    
    this.entity.addChild(this.box);
    this.orientedBox = new OrientedBox(this.box.getWorldTransform());
    CollisionDetector.instance.add(this);
  },

  respawn() {
    if (this.orientedBox) {
      this.orientedBox.worldTransform = this.box.getWorldTransform();
    }
  },

  onDestroy() {
    CollisionDetector.instance.remove(this);
  },

  getBound() {
    return this.box.model.meshInstances[0].aabb;
  },
});
