import { Entity, Vec3 } from "playcanvas";
import { CollisionTag } from "../../../../physics/collisionTag";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Game } from "../../../../game";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { SoliderController } from "../../../scripts/controllers/soliderController";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";
import { Tween } from "../../../../template/systems/tween/tween";
export class Solider extends Entity {
  constructor(type, direction) {
    super("solider-" + type);
    this.type = type;
    this.number = new Entity();
    this.addChild(this.number);
    let mat;
    if (type === CollisionTag.SoliderPlayer) {
      mat = AssetLoader.getAssetByKey("mat_blue_number").resource;
    } else {
      mat = AssetLoader.getAssetByKey("mat_red_number").resource;
    }
    this.number.addComponent("model", {
      asset: AssetLoader.getAssetByKey("model_1"),
      batchGroupId: Game.numberBatch.id,
    });
    this.number.model.meshInstances[0].material = mat;
    this.setLocalScale(0.1, 0.1, 0.1);
    this.boxCollider = this.addScript(BoxCollider, {
      tag: this.type,
      render: GameConstant.DEBUG_COLLIDER,
      scale: new Vec3(0.5, 1, 0.5),
    });
    this.controller = this.addScript(SoliderController, {
      direction: direction,
      collider: this.boxCollider,
    });
    this.controller.initialize();
  }

  setTarget(target) { 
    this.tweenMove?.stop();
    this.tweenMove = Tween.createLocalTranslateTween(this, target, {
      duration: 1,
      delay: 0.3,
    }).start();
  }

  setDestination(pos) {
    this.controller.setDestination(pos);
  }

  despawn() {
    this.setLocalScale(0.1, 0.1, 0.1);
    this.tweenScale?.stop();
    this.tweenMove?.stop();
    this.boxCollider && this.boxCollider.enable();
    this.fire(SpawningEvent.Despawn);
  }

  scaleUp() {
    this.tweenScale?.stop();
    this.tweenScale = Tween.createScaleTween(this, { x: 0.7, y: 0.7, z: 0.7 }, {
      duration: 0.7,
      delay: 0.2,
      onComplete: () => { 
        this.controller.start();
      }
    }).start();
  }
}