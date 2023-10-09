import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";
import { Tween } from "../../../../template/systems/tween/tween";
import { Util } from "../../../../helpers/util";
export const EndWallEvent = Object.freeze({
  Break: "break",
});
export class EndWall extends Entity {
  constructor() {
    super("end-wall");

    this.addComponent("model", { type: "box" });
    this.text = new Entity("text");
    this.text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 8,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "0",
    });
    this.text.setLocalPosition(0, 0, -1);
    this.text.setLocalEulerAngles(0, 180, 0);
    this.text.setLocalScale(0.05, 0.05, 0.05)
    this.addChild(this.text);

    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.EndWall,
      pos: new Vec3(0, 0, 0),
      scale: new Vec3(1, 1, 1),
      render: GameConstant.DEBUG_COLLIDER
    });

    this.break = new Entity("break");
    this.break.addComponent("model", { asset: AssetLoader.getAssetByKey("model_end_wall_break") });
    this.addChild(this.break);
    this.break.setLocalScale(0.25, 0.35, 1);
    this.break.setLocalPosition(0, -0.5, 0);
    this.break.enabled = false;
    this.child = this.break.children[0].children[0].children;
    this.child.forEach(entity => {
      entity.originalPos = entity.getLocalPosition().clone();
    });
    this.on(SpawningEvent.Spawn, this.reset, this);
    this.operator = "+";
  }

  reset() {
    this.collider && this.collider.enable();
    this.text.enabled = true;
    this.model.enabled = true;
    this.break.enabled = false;
    this.child.forEach(entity => {
      entity.setLocalPosition(entity.originalPos);
    });
  }

  config(data, operator = "-") {
    this.value = data.value;
    this.collider && this.collider.enable();
    this.text.enabled = true;
    this.model.enabled = true;
    this.break.enabled = false;
    this.child.forEach(entity => {
      entity.setLocalPosition(entity.originalPos);
    });
    this.model.meshInstances[0].material = data.material;
    this.break.model.meshInstances.forEach(mesh => { 
      mesh.material = data.material;
    });
    this.setLocalPosition(data.position.x, data.size.y / 2, data.position.z);
    this.text.element.text = operator + data.value.toString();
    this.setLocalScale(data.size);
    this.setLocalEulerAngles(data.rot.x, data.rot.y, data.rot.z);
    this.operator = operator;
  }

  onCollide() {
    this.collider && this.collider.disable();
    this.model.enabled = false;
    this.text.enabled = false;
    this.onBreak();
  }

  onBreak() {
    this.break.enabled = true;
    this.fire(EndWallEvent.Break);
    
    for (let i = 0; i < this.child.length; i++) {
      let entity = this.child[i];
      let pos = Util.randomVector(new Vec3(-1000, 0, -2000), new Vec3(1000, 3000, 0));
      Tween.createLocalTranslateTween(entity, pos, {
        duration: 1,
        easing: Tween.Easing.Quadratic.Out,
        onComplete: () => {
          this.fire(SpawningEvent.Despawn);
        }
      }).start();
    }
  }
}