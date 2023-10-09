import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Sprite, TextureAtlas, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import confetti from "canvas-confetti";
import { Game } from "../../../game";
import smileAtlasData from "../../../../assets/jsons/icon_smile_anim.json"
export const WinScreenEvent = Object.freeze({
  ButtonContinueClicked: "buttonContinueClicked",
});
export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);

    this._initFakeBg();
    this._initPanel();
    this._initTextComplete();
    this._initButtonContinue();
    this._initIconSmile();
    this._initConfetti();
  }

  create() { 
    super.create();
    this.fireEffect();
  }

  resize() {
    super.resize();
    this._resizeConfetti();
  }

  _initConfetti() {
    this.confettiCanvas = document.createElement("canvas");
    document.body.appendChild(this.confettiCanvas);
    this.confettiCanvas.style.position = "fixed";
    this.confettiCanvas.style.top = "0";
    this.confettiCanvas.style.left = "0";
    this.confettiCanvas.style.pointerEvents = "none";
    this.confettiCanvas.style.zIndex = 100;
    this.confettiCanvas.style.backgroundColor = "transparent";
    this.confettiCanvas.width = Game.width;
    this.confettiCanvas.height = Game.height;

    this.confetti = confetti.create(this.confettiCanvas, {
      resize: true,
    });
  }

  _resizeConfetti() {
    this.confettiCanvas.width = Game.width;
    this.confettiCanvas.height = Game.height;
  }

  fireEffect() {
    this.tween?.stop();
    this.tween = Tween.createCountTween({
      duration: 2,
      loop: true,
      onStart: () => {
        this.playFx();
      },
      onRepeat: () => {
        this.playFx();
      }
    }).start();
  }

  playFx() {
    this.confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 0, y: 1 },
      angle: 80,
      scalar: 2,
      startVelocity: 100,
    });
    this.confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 1, y: 1 },
      angle: 100,
      scalar: 2,
      startVelocity: 100,
    });
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.7;
  }

  _initPanel() {
    this.panel = ObjectFactory.createImageElement("spr_panel_win", {
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
    });
    this.addChild(this.panel);
  }

  _initIconSmile() {
    let texture = AssetLoader.getAssetByKey("tex_icon_smile_anim").resource;
    let textureAtlas = new TextureAtlas();
    textureAtlas.texture = texture;
    textureAtlas.frames = [];
    Object.keys(smileAtlasData.frames).forEach((key) => { 
      let frame = smileAtlasData.frames[key];
      let y = texture.height - frame.frame.y - frame.frame.h;
      textureAtlas.setFrame(key, {
        rect: new Vec4(frame.frame.x, y, frame.frame.w, frame.frame.h),
        pivot: new Vec2(0.5, 0.5),
        border: new Vec4(0, 0, 0, 0),
      });
    });
    let sprite = new Sprite(Game.app.graphicsDevice, {
      atlas: textureAtlas,
      frameKeys: Object.keys(smileAtlasData.frames),
      pixelsPerUnit: 100,
      renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
    });
    this.icon = new Entity("smile_icon");
    this.icon.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      sprite: sprite,
      anchor: new Vec4(0.47, 0.4, 0.47, 0.4),
      pivot: new Vec2(0.5, 0.5),
    });
    this.panel.addChild(this.icon);
    this._initSmileTween();
    this.smile();
  }

  destroy() {
    super.destroy();
    this.stop();
  }

  _initSmileTween() {
    let totalFrame = 20;
    this.tweenSmile = Tween.createTween({ t: 0 }, { t: totalFrame }, {
      duration: totalFrame / 30,
      loop: true,
      onUpdate: (obj) => {
        let index = Math.floor(obj.t);
        this.icon.element.spriteFrame = index;
        let frameName = Object.keys(smileAtlasData.frames)[index];
        let frame = smileAtlasData.frames[frameName];
        this.icon.element.width = frame.frame.w;
        this.icon.element.height = frame.frame.h;
      }
    });
  }

  smile() {
    this.tweenSmile?.stop();
    this.tweenSmile.start();
  }

  stop() {
    this.tween?.stop();
    this.confettiCanvas.style.display = "none";
  }

  play() {
    this.tween.start();
    this.confettiCanvas.style.display = "block";
  }

  _initTextComplete() {
    this.completeText = new Entity();
    this.completeText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.83, 0.5, 0.83),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.COMPLETE_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.panel.addChild(this.completeText);
  }

  _initButtonContinue() {
    this.btnContinue = ObjectFactory.createImageElement("spr_btn_green", {
      anchor: new Vec4(0.5, 0, 0.5, 0),
    });
    this.btnContinue.setLocalPosition(0, -60, 0);
    this.panel.addChild(this.btnContinue);
    let textContinue = new Entity();
    textContinue.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 42,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.CONTINUE_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnContinue.addChild(textContinue);
    Util.registerOnTouch(this.btnContinue.element, this._onTapButtonContinue, this);

    this.tweenBtnContinue = Tween.createScaleTween(this.btnContinue, new Vec3(1.2, 1.2, 1.2), {
      duration: 0.5,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    }).start();
  }

  _onTapButtonContinue() {
    this.fire(WinScreenEvent.ButtonContinueClicked);
    this.tweenBtnContinue.stop();
  }
}