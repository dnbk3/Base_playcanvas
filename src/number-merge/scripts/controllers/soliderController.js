import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { CollisionEvent } from "../../../physics/collissionEvent";
import { CollisionTag } from "../../../physics/collisionTag";
import { SoliderManager } from "../../manager/soliderManager";
import { Tween } from "../../../template/systems/tween/tween";
import { Util } from "../../../helpers/util";
import { GameConstant } from "../../../gameConstant";

export const SoliderController = Script.createScript({
  name: "soliderController",
  attributes: {
    direction: { default: 1 },
    collider: { default: null },
  },

  initialize() {
    this.destination = new Vec3();
    this.started = false;
    this.tmpDistance = new Vec3(0, 0, GameConstant.SOLIDER_MOVE_DISTANCE);
    this.tmpPos = new Vec3();
  },

  setDestination(destination) {
    this.destination.copy(destination);
  },

  onCollide(other) { 
    
  },

  start() {
    this.started = true;
    this.tweenMove?.stop();
    this.tweenMoveX?.stop();
    this.tweenWin?.stop();
    if (this.direction === 1) {
      this.tmpPos = this.entity.getLocalPosition().clone().add(this.tmpDistance);
    } else {
      this.tmpPos = this.entity.getLocalPosition().clone().sub(this.tmpDistance);
    }
    let distance = this.entity.getLocalPosition().clone().distance(this.tmpPos);
    let duration = distance / GameConstant.SOLIDER_MOVE_SPEED;
    this.tweenMove = Tween.createLocalTranslateTween(this.entity, {z: this.tmpPos.z}, {
      duration: Util.random(duration, duration + 0.5),
      delay: Util.random(0, 0.5),
      yoyo: true,
      loop: true,
      onRepeat: () => {
        let tmpX = Util.random(-GameConstant.SOLIDER_MOVE_DISTANCE / 4, GameConstant.SOLIDER_MOVE_DISTANCE / 4);
        this.tweenMoveX = Tween.createLocalTranslateTween(this.entity, { x: tmpX }, {
          duration: 1,
        }).start();
      }
    }).start();
  },

  onWin() {
    this.started = false;
    this.speed = 0;
    this.tweenMove?.stop();
    this.tweenMoveX?.stop();
    this.tweenWin?.stop();
    this.tweenWin = Tween.createLocalTranslateTween(this.entity, { y: "+1" }, {
      duration: 0.5,
      loop: true,
      yoyo: true,
      delay: Util.random(0, 0.7),
      easing: Tween.Easing.Quadratic.InOut,
    }).start();
  },

  onLose() {
    this.started = false;
    this.speed = 0;
    this.tweenMove?.stop();
    this.tweenMoveX?.stop();
    this.tweenWin?.stop();
  },

  update() {
    if (!this.started) {
      return;
    }
  }
});