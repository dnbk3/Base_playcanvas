import { Vec3 } from "playcanvas";
import { Tween } from "../../../../template/systems/tween/tween";
import { SawBlade } from "./sawBlade";

export class SawBladeMove extends SawBlade {
  constructor() {
    super();

    this.rot.speed = new Vec3(0, 0, -400);
  }

  config(data) { 
    super.config(data);
    this.duration = data.duration;
    let baseSize = data.baseSize;
    let range = baseSize.x / 2 - 0.5;
    this.modelSawBlade.setLocalPosition(range, 0, 0);
    this.base.setLocalScale(baseSize.x, baseSize.y, baseSize.z);
    Tween.createLocalTranslateTween(this.modelSawBlade, {
      x: -range,
    }, {
      duration: this.duration,
      loop: true,
      yoyo: true,
    }).start();
  }
}