import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";

export class FinishLine extends Entity{
  constructor() {
    super("finish-line");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_finish_line") });

    this.collider = this.addScript(BoxCollider, {
      tag   : CollisionTag.FinishLine,
      render: GameConstant.DEBUG_COLLIDER,
      scale : new Vec3(7.4, 1, 1),
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider && this.collider.enable();
    });
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
}