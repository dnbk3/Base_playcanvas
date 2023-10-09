import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Script } from "../../../template/systems/script/script";
import { PlayerEvent } from "./playerController";

export const LevelController = Script.createScript({
  name: "levelController",
  attributes: {
    player: { default: null },
  },

  initialize() { 
    this.redMat = AssetLoader.getAssetByKey("mat_red_number").resource;
    this.blueMat = AssetLoader.getAssetByKey("mat_blue_number").resource;
    this.player.controller.on(PlayerEvent.Eat, this.onPlayerChangeValue, this);
  },

  onStart() {
    this.allNumber = this.entity.numbers;
    this.updateMaterial(this.player.value);
  },

  updateMaterial(value) {
    for (let i = 0; i < this.allNumber.length; i++) {
      const num = this.allNumber[i];
      let mat = num.getMaterial(value);
      num.updateMaterial(mat);
    }
  },

  onPlayerChangeValue(value) {
    this.updateMaterial(value);
  },
});