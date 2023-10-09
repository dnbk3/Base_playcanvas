import { Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { Script } from "../../../template/systems/script/script";
import { Tween } from "../../../template/systems/tween/tween";

export const ObjectBreak = Script.createScript({
  name: "objectBreak",
  attributes: {
    pieces: { default: [] },
    speed: { default: 100 }
  },

  initialize() { 
  },

  update() { 
  },

  play() {
    this.pieces.forEach(piece => {
      let tmpPosX = Util.random(-50, 50);
      let tmpPosZ = Util.random(-50, 50);
      Tween.createLocalTranslateTween(piece, {
        x: tmpPosX, z: tmpPosZ
      }, {
        duration: 1,
        easing: Tween.Easing.Sinusoidal.InOut,
      }).start();
      let tmpRot = Util.randomVector(new Vec3(-50, -50, -50), new Vec3(50, 50, 50));
      Tween.createRotateTween(piece, tmpRot, {
        duration: 1,
      }).start();
      Tween.createLocalTranslateTween(piece, {
        y: 5
      }, {
        duration: 1,
        easing: Tween.Easing.Bounce.Out,
      }).start();
    });
  }
});