import { Curve, Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class Jump extends Entity{
  constructor() {
    super();
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_jump") });
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Jump,
      position: new pc.Vec3(0, 0.5, 0),
      scale: new pc.Vec3(1.4, 1, 1),
      render: GameConstant.DEBUG_COLLIDER
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider && this.collider.enable();
    });
    this.curve = new Curve([
      0, 0.5,
      0.05, 1,
      0.1, 1.417,
      0.15, 1.817,
      0.2, 2.3,
      0.25, 2.7,
      0.3, 3.023,
      0.35, 3.223,
      0.4, 3.354,
      0.45, 3.454,
      0.5, 3.546,
      0.55, 3.446,
      0.6, 3.354,
      0.65, 3.254,
      0.7, 3.023,
      0.75, 2.7,
      0.8, 2.3,
      0.85, 1.817,
      0.9, 1.417,
      0.95, 1,
      1, 0.5,
    ]);
  }

  config(data) { 
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.distanceJump = data.distanceJump;
  }

  onCollide() { 
    this.collider && this.collider.disable();
  }
}