import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { GameState, GameStateManager } from "../../../template/gameStateManager";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Tween } from "../../../template/systems/tween/tween";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Game } from "../../../game";
import { UserData } from "../../data/userData";
export const TutorialScreenEvent = Object.freeze({
  ButtonIncomeClicked: "buttonIncomeClicked",
  ButtonStartNumberClicked: "buttonStartNumberClicked",
  OnTapBackground: "onTapBackground",
});
export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);

    this._initFakeBg();
    this._initButtonNumberCount();
    this._initTutorial();
    this.resize();
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0;
    Util.registerOnTouch(this.fakeBg.element, this._onTapBg, this);
  }

  _initTutorial() {
    this.arrow = ObjectFactory.createImageElement("spr_arrow", {
      anchor: new Vec4(0.5, 0.45, 0.5, 0.45),
    });
    this.addChild(this.arrow);
    this.hand = ObjectFactory.createImageElement("spr_hand", {
      anchor: new Vec4(0.5, 0.45, 0.5, 0.45),
    });
    this.hand.setLocalPosition(-140, -40, 0);
    this.addChild(this.hand);
    this.tweenHand = Tween.createLocalTranslateTween(this.hand, { x: 180 }, {
      duration: 1,
      delay: 1,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    });
  }

  play() {
    this.tweenHand?.stop();
    this.tweenHand.start();
  }

  stop() {
    this.tweenHand?.stop();
  }

  _onTapBg() {
    this.fire(TutorialScreenEvent.OnTapBackground);
  }

  _initButtonNumberCount() {
    this.btnNumberCount = ObjectFactory.createImageElement("spr_btn_number_count", {
      anchor: new Vec4(0.3, 0.2, 0.3, 0.2),
    });
    this.addChild(this.btnNumberCount);
    let iconMoney = ObjectFactory.createImageElement("spr_icon_money", {
      anchor: new Vec4(0, 0, 0, 0),
    });
    iconMoney.setLocalScale(0.4, 0.4, 0.4);
    iconMoney.setLocalPosition(45, 35, 0);
    this.btnNumberCount.iconMoney = iconMoney;
    this.btnNumberCount.addChild(iconMoney);
    let iconAds = ObjectFactory.createImageElement("spr_icon_ads", { anchor: new Vec4(0, 0, 0, 0), });
    iconAds.setLocalScale(0.4, 0.4, 0.4);
    iconAds.setLocalPosition(45, 35, 0);
    this.btnNumberCount.addChild(iconAds);
    this.btnNumberCount.iconAds = iconAds;
    this.btnNumberCount.iconAds.enabled = false;

    this.btnIncome = ObjectFactory.createImageElement("spr_btn_income", {
      anchor: new Vec4(0.7, 0.2, 0.7, 0.2),
    });
    this.addChild(this.btnIncome);
    let iconMoney2 = iconMoney.clone();
    this.btnIncome.addChild(iconMoney2);
    this.btnIncome.iconMoney = iconMoney2;
    let iconAds2 = iconAds.clone();
    this.btnIncome.addChild(iconAds2);
    this.btnIncome.iconAds = iconAds2;
    this.btnIncome.iconAds.enabled = false;
    this.curStartNumberText = new Entity("startNumberText");
    this.curStartNumberText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.36, 0.5, 0.36),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "1",
    });
    this.btnNumberCount.addChild(this.curStartNumberText);
    this.curStartNumberText.setLocalPosition(-60, 0, 0);
    this.nextStartNumberText = this.curStartNumberText.clone();
    this.btnNumberCount.addChild(this.nextStartNumberText);
    this.nextStartNumberText.element.text = "2";
    this.nextStartNumberText.element.color = Util.createColor(236, 243, 16);
    this.nextStartNumberText.element.fontSize = 56;
    this.nextStartNumberText.setLocalPosition(60, 0, 0);
    this.moneyStartNumberText = this.curStartNumberText.clone();
    this.btnNumberCount.addChild(this.moneyStartNumberText);
    this.moneyStartNumberText.element.text = "100";
    this.moneyStartNumberText.element.anchor = new Vec4(1, 0, 1, 0);
    this.moneyStartNumberText.setLocalPosition(-55, 35, 0);

    this.curIncomeText = this.curStartNumberText.clone();
    this.btnIncome.addChild(this.curIncomeText);
    this.curIncomeText.element.text = "x1";
    this.nextIncomeText = this.nextStartNumberText.clone();
    this.btnIncome.addChild(this.nextIncomeText);
    this.nextIncomeText.element.text = "x1.1";
    this.moneyIncomeText = this.moneyStartNumberText.clone();
    this.btnIncome.addChild(this.moneyIncomeText);

    Util.registerOnTouch(this.btnIncome.element, this._onTapBtnIncome, this);
    Util.registerOnTouch(this.btnNumberCount.element, this._onTapBtnStartNumber, this);
  }

  _initTween(scale) {
    this.btnNumberCount.setLocalScale(scale, scale, scale);
    this.tweenButtonNumberCount?.stop();
    this.tweenButtonNumberCount = Tween.createScaleTween(this.btnNumberCount, { x: scale * 1.1, y: scale * 1.1, z: scale * 1.1 }, {
      duration: 0.15,
      repeat: 1,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
    });
    this.btnIncome.setLocalScale(scale, scale, scale);
    this.tweenButtonIncome?.stop();
    this.tweenButtonIncome = Tween.createScaleTween(this.btnIncome, { x: scale * 1.1, y: scale * 1.1, z: scale * 1.1 }, {
      duration: 0.15,
      repeat: 1,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
    });
  }

  playAnimBtnNumberCount() { 
    this.tweenButtonNumberCount?.stop();
    this.tweenButtonNumberCount.start();
  }

  playAnimBtnIncome() {
    this.tweenButtonIncome?.stop();
    this.tweenButtonIncome.start();
  }

  _onTapBtnIncome() {
    this.fire(TutorialScreenEvent.ButtonIncomeClicked);
  }

  _onTapBtnStartNumber() {
    this.fire(TutorialScreenEvent.ButtonStartNumberClicked);
  }

  updateStartNumberText(startNumber, money) { 
    this.curStartNumberText.element.text = startNumber;
    this.moneyStartNumberText.element.text = Util.getCashFormat(money);
    this.nextStartNumberText.element.text = startNumber + GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP;
    if(UserData.currency >= money) {
      this.moneyStartNumberText.element.color = Util.createColor(255, 255, 255);
      this.btnNumberCount.iconAds.enabled = false;
      this.btnNumberCount.iconMoney.enabled = true;
    } else {
      this.moneyStartNumberText.element.color = Util.createColor(245, 113, 111);
      this.btnNumberCount.iconAds.enabled = true;
      this.btnNumberCount.iconMoney.enabled = false;
    }
  }

  updateIncomeText(income, money) { 
    this.curIncomeText.element.text = "x" + income.toFixed(1);
    this.nextIncomeText.element.text = "x" + (income + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP).toFixed(1);
    this.moneyIncomeText.element.text = Util.getCashFormat(money);
    if (UserData.currency >= money) {
      this.moneyIncomeText.element.color = Util.createColor(255, 255, 255);
      this.btnIncome.iconAds.enabled = false;
      this.btnIncome.iconMoney.enabled = true;
    } else {
      this.moneyIncomeText.element.color = Util.createColor(245, 113, 111);
      this.btnIncome.iconAds.enabled = true;
      this.btnIncome.iconMoney.enabled = false;
    }
  }

  resize() {
    super.resize();
    let scale = 1;
    let anchor2 = new Vec4(0.7, 0.25, 0.7, 0.25);
    let anchor1 = new Vec4(0.3, 0.25, 0.3, 0.25);
    if (Game.height < Game.width) {
      scale = 0.5;
      anchor1 = new Vec4(0.43, 0.3, 0.43, 0.3);
      anchor2 = new Vec4(0.57, 0.3, 0.57, 0.3);
    }
    this.btnIncome.setLocalScale(scale, scale, scale);
    this.btnNumberCount.setLocalScale(scale, scale, scale);
    this.btnIncome.element.anchor = anchor1;
    this.btnNumberCount.element.anchor = anchor2;
    this.arrow.setLocalScale(scale, scale, scale);
    this.hand.setLocalScale(scale, scale, scale);
    this._initTween(scale);
  }
}