import { ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";
import { Game } from "../../../game";

export class DebugPanel extends Entity{ 
  constructor() {
    super("debug-panel");
    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0, 0, 0.2, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(0, 0, 0, 0),
      color: Util.createColor(85, 85, 85),
    });
    this.fpsText = new Entity();
    this.fpsText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 44,
      autoWidth: true,
      autoHeight: true,
      color: Util.createColor(200, 200, 200),
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "100",
    });
  }

  updateFps() {
    // this.fpsText.element.text = Math.floor(Game.app.graphicsDevice.fps).toString() + " FPS";
  }
}