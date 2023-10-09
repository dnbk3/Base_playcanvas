import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { EndCardBoss } from "./endCardBoss";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../template/systems/tween/tween";
import { NumberBreak } from "../obstacles/number/numberBreak";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
export const BigBossEvent = Object.freeze({
  Break: "break",
});
export class BigBoss extends EndCardBoss{
  constructor() {
    super("big-boss");

    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_bigBoss") });
    let colliderStartEntity = new Entity();
    this.addChild(colliderStartEntity);
    this.colliderStart = colliderStartEntity.addScript(BoxCollider, {
      tag: CollisionTag.BigBossStart,
      scale: new Vec3(7.47, 1, 1),
      position: new Vec3(0, 0.5, -2),
      render: GameConstant.DEBUG_COLLIDER
    });
    this.breaks = [];
    this.on(SpawningEvent.Despawn, () => { 
      this.colliderStart.enable();
      this.numberGroup.enabled = true;
      this.numberGroup.collider.enable();
      this.breaks.forEach(breakNumber => {
        breakNumber.destroy();
        this.numberGroup.removeChild(breakNumber);
      });
    });
  }
  
  onCollide() {
    this.numberGroup.collider.disable();
  }

  onWin() {
    Tween.createLocalTranslateTween(this.numberGroup, {
      z: "+3",
    }, {
      duration: 0.7,
      easing: Tween.Easing.Quadratic.Out
    }).start();
  }

  onLose() {
    this.spawnBreakNumber();
    this.fire(BigBossEvent.Break);
  }

  spawnBreakNumber() {
    let nums = this.numberGroup.elements;
    for (let i = 0; i < nums.length; i++) {
      let number = nums[i];
      let pos = number.getLocalPosition();
      let rot = number.getLocalEulerAngles();
      let scale = number.getLocalScale();
      let value = this.numberGroup.value.toString()[i];
      let numberBreak = new NumberBreak(parseInt(value));
      this.numberGroup.addChild(numberBreak);
      numberBreak.setLocalPosition(pos);
      numberBreak.setLocalEulerAngles(rot);
      numberBreak.setLocalScale(scale);
      numberBreak.updateMaterial(number.model.meshInstances[0].material);
      numberBreak.objectBreak.play();
      this.breaks.push(numberBreak);
      number.fire(SpawningEvent.Despawn);
    }
  }
}