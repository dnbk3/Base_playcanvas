import { Entity, math, Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const CameraController = Script.createScript({
  name: "cameraController",

  attributes: {
    target: {},
    speed: { default: 1 },
    offset: { default: new Vec3() },
    limitX: { default: 0 },
  },

  _targetPos: null,
  _tmpPos: null,

  initialize() {
    this._tmpPos = new Vec3();
    this._targetPos = new Vec3();
  },

  update() {
    let cameraX = this.target.getPosition().x;
    if (cameraX < -this.limitX || cameraX > this.limitX) {
      cameraX = this.limitX * Util.sign(cameraX);
    }

    let cameraPos = this.entity.getPosition();
    cameraPos.x = math.lerp(cameraPos.x, cameraX + this.offset.x, this.speed * Time.dt);
    this._targetPos.add2(this.target.getPosition(), this.offset);
    this.entity.setPosition(cameraPos.x, this.offset.y, this._targetPos.z);
  },

  onPlayerDie() {
    this._targetPos.copy(this.target.getPosition());
    let temp = new Entity();
    temp.setPosition(this._targetPos.x, this._targetPos.y, this._targetPos.z + 10);
    this.target = temp;
    this.speed = 0.8;
  },
});
