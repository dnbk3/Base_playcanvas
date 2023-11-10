import { Entity } from "playcanvas";
import { Game } from "../game";
import { AssetLoader } from "../assetLoader/assetLoader";
export class SoundManager {
  static initSound(audioAssets) {
    this.soundManagerEntity = new Entity();
    Game.app.root.addChild(this.soundManagerEntity);
    this.soundManager = this.soundManagerEntity.addComponent("sound");
    audioAssets.forEach((asset) => {
      this.addSoundSlot(asset.name);
    });
  }

  static addSoundSlot(soundName) {
    this[soundName] = this.soundManagerEntity.sound.addSlot(soundName, {
      asset: AssetLoader.getAssetByKey(soundName),
      pitch: 1,
      loop: false,
      volume: 1,
      autoPlay: false,
      overlap: true,
    });
  }

  static play(id, loop = false, volume = 1) {
    this[id].loop = loop;
    this[id].volume = volume;
    this.soundManagerEntity.enabled && this[id].play();
  }

  static pause(id) {
    this[id].pause();
  }

  static resume(id) {
    this[id].resume();
  }

  static stop(id) {
    this[id].stop();
  }

  static muteAll(isMute) {
    let volume = isMute ? 0 : 1;
    this.soundManager.volume = volume;
  }
}
