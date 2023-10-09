import { Vec3, math } from "playcanvas";
import { CollisionEvent } from "../../../physics/collissionEvent";
import { Script } from "../../../template/systems/script/script";
import { SpawningEvent } from "../spawners/spawningEvent";
import { Time } from "../../../template/systems/time/time";
import { Tween } from "../../../template/systems/tween/tween";
export const RedDamageControllerEvent = Object.freeze({
  Hit: "hit",
});
export const RedDamageController = Script.createScript({
  name: "redDamageController",
  attributes: {
    damage: { default: 1 },
    collider: { default: null },
  },

  initialize() {
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.collider.on(CollisionEvent.NotCollide, this.notCollide, this);
  },

  reset() {
    this._value = this.entity.value;
    this.maxValue = this.entity.value / 10;
    this._targetScale = new Vec3();
    this.originalScaleX = this.entity.getLocalScale().x;
    this.originalScaleY = this.entity.getLocalScale().y;
    this.started = false;
    this.size = this.collider.box.getLocalScale().clone().z * this.entity.getLocalScale().clone().z;
    this.tmpScale = this.entity.getLocalScale();
    this.isEndForce = false;
  },

  onCollide(other) {
    this.onHit();
    this.started = true;
  },

  notCollide() {
    this.started = false;
  },

  update() {
    if (!this.started) { 
      return;
    }
    if (!this._targetScale.equals(this.entity.getLocalScale())) {
      this._targetScale.lerp(this.entity.getLocalScale(), this.tmpScale, 10 * Time.dt);
      this.entity.setLocalScale(this.originalScaleX, this.originalScaleY, this._targetScale.z);
    }
  },

  onHit() {
    this._value -= this.damage;
    this.entity.text.element.text = "-" + this._value;
    if (this._value <= this.maxValue) { 
      this.isEndForce = true;
    }
    if (this._value <= 0) {
      this.collider.disable();
      this.entity.fire(RedDamageControllerEvent.Hit, this.entity);
      Tween.createScaleTween(this.entity, { z: 0.1 }, {
        duration: 0.1,
        onUpdate: () => {
        },
        onComplete: () => {
          this.entity.fire(SpawningEvent.Despawn, this.entity);
        }
      }).start();
    }
    let percent = this._value / this.entity.value;
    this.tmpScale = this.entity.getLocalScale().clone().scale(percent);
    let tmpPos = this.entity.getLocalPosition();
    if (this.isEndForce) {
      tmpPos.z += 0.05;
    } else {
      tmpPos.z += 0.01;
     }
    this.entity.setLocalPosition(tmpPos);
  },

});