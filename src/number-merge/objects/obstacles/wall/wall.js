import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";
import { BlockAreaManager } from "../../blockArea/blockAreaManager";
export class Wall extends Entity {
  constructor() {
    super("road_wall");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_wall") });
    let headWall = new Entity("head_wall");
    this.addChild(headWall);
    this.colliderHead = headWall.addScript(BoxCollider, {
      tag: CollisionTag.HeadWall,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(4.5, 1, 0),
      scale: new Vec3(0.25, 2, 0.4),
    });
    let topWall = new Entity("top_wall");
    this.addChild(topWall);
    this.colliderTop = topWall.addScript(BoxCollider, {
      tag: CollisionTag.HeadWall,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 2, 0),
      scale: new Vec3(7.8, 0.15, 0.4),
    });

    let bodyWall = new Entity("body_wall");
    this.addChild(bodyWall);
    this.colliderBody = bodyWall.addScript(BoxCollider, {
      tag: CollisionTag.BodyWall,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 1, 0),
      scale: new Vec3(8.2, 2, 1),
    });
    this.on(SpawningEvent.Spawn, this.onSpawn, this);
    this.on(SpawningEvent.Despawn, this.onDespawn, this);
  }

  onDespawn() {
  }

  onSpawn() {
    this.colliderHead.enable();
    this.colliderTop.enable();
    this.colliderBody.enable();
    this.colliderBody.respawn();
    BlockAreaManager.instance.addWallBlockArea(this.colliderBody);
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