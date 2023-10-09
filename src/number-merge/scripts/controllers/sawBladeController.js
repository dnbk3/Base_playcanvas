import { CollisionEvent } from "../../../physics/collissionEvent";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const SawBladeController = Script.createScript({
  name: "sawBladeController",
  attributes: {
    collider: { default: null },
    attackRate: { default: 0.1 },
    damage: { default: 1 },
  },

  initialize() { 
    this._currTime = 0;
    this._started = false;
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.collider.on(CollisionEvent.NotCollide, this.notCollide, this);
  },

  reset() {
    this._currTime = 0;
    this._started = false;
  },

  onCollide(other) {
    this._started = true;
  },

  notCollide(other) {
    this._started = false;
  },

  update() {
    if (!this._started) {
      return;
    }
    if (Time.current - this._currTime >= this.attackRate) {
      this._currTime = Time.current;
      this.collider.enable();
    } else {
      this.collider.disable();
    }
  }
});