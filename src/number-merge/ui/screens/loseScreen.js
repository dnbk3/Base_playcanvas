import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Sprite, TextureAtlas, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import iconData from "../../../../assets/jsons/icon_cry_anim.json"
import { Game } from "../../../game";
export const LoseScreenEvent = Object.freeze({
  ButtonTryAgainClicked: "buttonTryAgainClicked",
});
export class LoseScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);

    this._initFakeBg();
    this._initPanel();
    this._initTextDefeat();
    this._initButtonTryAgain();
    this._initIconCry();
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.7;
  }

  _initPanel() {
    this.panel = ObjectFactory.createImageElement("spr_panel_lose", {
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
    });
    this.addChild(this.panel);
  }

  _initIconCry() {
    let texture = AssetLoader.getAssetByKey("tex_icon_cry_anim").resource;
    let textureAtlas = new TextureAtlas();
    textureAtlas.texture = texture;
    textureAtlas.frames = [];
    Object.keys(iconData.frames).forEach((key) => {
      let frame = iconData.frames[key];
      let y = texture.height - frame.frame.y - frame.frame.h;
      textureAtlas.setFrame(key, {
        rect: new Vec4(frame.frame.x, y, frame.frame.w, frame.frame.h),
        pivot: new Vec2(0.5, 0.5),
        border: new Vec4(0, 0, 0, 0),
      });
    });
    let sprite = new Sprite(Game.app.graphicsDevice, {
      atlas: textureAtlas,
      frameKeys: Object.keys(iconData.frames),
      pixelsPerUnit: 100,
      renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
    });
    this.icon = new Entity("cry_icon");
    this.icon.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      sprite: sprite,
      anchor: new Vec4(0.47, 0.3, 0.47, 0.3),
      pivot: new Vec2(0.5, 0.5),
    });
    this.panel.addChild(this.icon);
    this._initCryTween();
    this.cry();
  }

  destroy() {
    super.destroy();
    this.stop();
  }

  _initCryTween() {
    let totalFrame = 29;
    this.tweenCry = Tween.createTween({ t: 0 }, { t: totalFrame }, {
      duration: 1,
      loop: true,
      onUpdate: (obj) => {
        let index = Math.floor(obj.t);
        this.icon.element.spriteFrame = index;
        let frameName = Object.keys(iconData.frames)[index];
        let frame = iconData.frames[frameName];
        this.icon.element.width = frame.frame.w;
        this.icon.element.height = frame.frame.h;
      }
    });
  }

  cry() {
    this.tweenCry?.stop();
    this.tweenCry.start();
  }

  stop() {
    this.tweenCry?.stop();
  }

  _initTextDefeat() { 
    this.defeatText = new Entity();
    this.defeatText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.DEFEAT_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.panel.addChild(this.defeatText);
  }

  _initButtonTryAgain() {
    this.btnTryAgain = ObjectFactory.createImageElement("spr_btn_yellow_big", {
      anchor: new Vec4(0.5, 0, 0.5, 0),
    });
    this.btnTryAgain.setLocalPosition(0, -60, 0);
    this.panel.addChild(this.btnTryAgain);
    let textTryAgain = new Entity();
    textTryAgain.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 42,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.TRY_AGAIN_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnTryAgain.addChild(textTryAgain);
    Util.registerOnTouch(this.btnTryAgain.element, this._onTapButtonTryAgain, this);

    this.tweenBtnTryAgain = Tween.createScaleTween(this.btnTryAgain, new Vec3(1.2, 1.2, 1.2), {
      duration: 0.5,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    }).start();
  }

  _onTapButtonTryAgain() {
    this.fire(LoseScreenEvent.ButtonTryAgainClicked);
    this.tweenBtnTryAgain.stop();
  }
}