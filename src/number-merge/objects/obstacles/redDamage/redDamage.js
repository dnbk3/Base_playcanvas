import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { RedDamageController } from "../../../scripts/controllers/redDamageController";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class RedDamage extends Entity{
  constructor() {
    super("red-damage");

    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_red_damage") });
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
    this.text.setLocalPosition(0, 1, -2.05);
    this.text.setLocalEulerAngles(0, 180, 0);
    this.text.setLocalScale(0.1, 0.17, 1)
    this.addChild(this.text);
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.RedDamage,
      position: new Vec3(0, 1, -1),
      scale: new Vec3(1.8, 1.8, 2),
      render: GameConstant.DEBUG_COLLIDER
    });
    this.controller = this.addScript(RedDamageController, {
      damage: 1,
      collider: this.collider
    });
    this.collider.initialize();
    this.on(SpawningEvent.Spawn, () => {
      this.collider && this.collider.enable();
    });
  }

  onCollide(player) { 
    
  }

  config(data) {
    this.value = data.value;
    this.text.element.text = "-" + data.value.toString();
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.controller.damage = data.damage;
    this.controller.reset();
  }
}