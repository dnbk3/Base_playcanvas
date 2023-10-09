import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { BlockAreaManager } from "../blockArea/blockAreaManager";
export class Road extends Entity {
  constructor() {
    super("road");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_road") });
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Road,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 0, 0),
      scale: new Vec3(7.425, 1, 5.13),
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider.enable();
      this.collider.respawn();
      BlockAreaManager.instance.addRoadBlockArea(this.collider);
    });
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setLocalPosition(pos.x, pos.y, pos.z);
    this.setLocalEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
}