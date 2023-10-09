import { Game } from "../../game";
import { Util } from "../../helpers/util";
import { AssetConfigurator } from "./assetConfigtor";
export class Configurator {
  static config() {
    this.scene = Game.app.scene;
    AssetConfigurator.config();
    this._configScene();
  }

  static _configScene() {
    this.scene.ambientLight = Util.createColor(255, 255, 255);
    this.scene.gammaCorrection = pc.GAMMA_SRGB;
  }
}
