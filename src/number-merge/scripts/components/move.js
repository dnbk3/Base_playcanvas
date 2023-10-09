import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const Move = Script.createScript({
  name: "moveScript",
  attributes: {
    speed: { default: new Vec3() },
    multiplier: { default: 1 },
  },

  update() {
    let pos = this.entity.getLocalPosition();
    pos.x += this.speed.x * this.multiplier * Time.dt;
    pos.y += this.speed.y * this.multiplier * Time.dt;
    pos.z += this.speed.z * this.multiplier * Time.dt;
    this.entity.setLocalPosition(pos);
  },
});
