import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Util } from "../../../helpers/util";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Spawner } from "../../scripts/spawners/spawner";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { Tween } from "../../../template/systems/tween/tween";
import { UserData } from "../../data/userData";
export class PlayScreen extends UIScreen {
  constructor(){ 
    super(GameConstant.SCREEN_PLAY);
    this._initLevelText();
    this._initCurrencyText();
    this._initIncomeText();
    this._initMoneySpawner();
  }
  
  create() {
    super.create();
  }

  spawnCash(screenPos) { 
    let pos = this.getScreenSpacePosition(screenPos);
    let cash = this.moneySpawner.spawn(this);
    cash.element.anchor.set(0, 0, 0, 0);
    cash.setLocalPosition(pos);
    let targetPos = this.currencyText.getPosition().clone().sub(new Vec3(0.2, 0, 0));
    Tween.createGlobalTranslateTween(cash, targetPos, {
      duration: 1,
      delay: Util.random(0, 0.3),
      onComplete: () => {
        this.currencyText.element.text = Util.formatCash(Math.ceil(UserData.currency));
        cash.fire(SpawningEvent.Despawn);
      }
    }).start();
  }

  playEffect(value, income) {
    this.incomeText.enabled = true;
    let targetPos = this.currencyText.getPosition().clone().sub(new Vec3(0.2, 0, 0));
    let index = 0;
    let valueStep = value * income / GameConstant.TOTAL_MONEY_SPAWN;
    this.incomeText.element.text = "x" + income.toFixed(1);
    for (let i = 0; i < GameConstant.TOTAL_MONEY_SPAWN; i++) {
      let money = this.moneySpawner.spawn(this.effectEntity);
      money.setLocalPosition(0, 0, 0);
      money.element.anchor.set(0.5, 0.5, 0.5, 0.5);
        Tween.createGlobalTranslateTween(money, targetPos, {
          duration: 0.9,
          delay: (GameConstant.TOTAL_MONEY_SPAWN - i) * 0.12,
          onComplete: () => {
            UserData.currency += valueStep;
            this.currencyText.element.text = Util.formatCash(Math.ceil(UserData.currency));
            index++;
            money.fire(SpawningEvent.Despawn);
            if (index >= GameConstant.TOTAL_MONEY_SPAWN) { 
              this.fire("playEffectComplete");
              this.incomeText.enabled = false;
            }
          }
      }).start();
    }
  }
  
  _initMoneySpawner() {
    let moneyEntity = new Entity("moneySpawner");
    this.addChild(moneyEntity);
    this.moneySpawner = moneyEntity.addScript(Spawner, {
      class: Money,
      poolSize: 10,
    });
    this.moneySpawner.initialize();
  }

  _initLevelText() {
    this.levelText = new Entity("levelText");
    this.levelText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 0.5),
      fontSize: 56,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.LEVEL_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.addChild(this.levelText);
    this.levelText.setLocalPosition(10, -30, 0);
  }

  _initIncomeText() {
    this.effectEntity = new Entity("effectEntity");
    this.addChild(this.effectEntity);
    this.incomeText = new Entity("incomeText");
    this.incomeText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.6, 0.5, 0.6, 0.5),
      pivot: new Vec2(0, 0.5),
      fontSize: 96,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "x1.0",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.effectEntity.addChild(this.incomeText);
    this.incomeText.enabled = false;
  }

  _initCurrencyText() { 
    this.bg = ObjectFactory.createImageElement("spr_bg_currency", {
      anchor: new Vec4(1, 1, 1, 1),
      pivot: new Vec2(1, 1),
    });
    this.bg.setLocalPosition(20, -10, 0);
    this.addChild(this.bg);
    let icon = ObjectFactory.createImageElement("spr_icon_money", {
      anchor: new Vec4(0, 0.5, 0, 0.5),
      pivot: new Vec2(0, 0.5),
    });
    icon.setLocalScale(0.4, 0.4, 0.4);
    icon.setLocalPosition(10, 0, 0);
    this.bg.addChild(icon);

    this.currencyText = new Entity("currencyText");
    this.currencyText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(1, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: 0,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.2,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.currencyText.setLocalPosition(-30, 0, 0);
    this.bg.addChild(this.currencyText);
  }

  updateCurrencyText(currency) { 
    this.currencyText.element.text = Util.formatCash(currency);
  }

  updateLevelText(level) { 
   this.levelText.element.text = GameConstant.LEVEL_TEXT + level;
  }

  update() {
    super.update();
  }

  resize() {
    super.resize();
  }
}

export class Money extends Entity{
  constructor() {
    super("moneyUI");
    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      spriteAsset: AssetLoader.getAssetByKey("spr_icon_money"),
    });
    this.on(SpawningEvent.Spawn, () => { 
      this.setLocalScale(0.5, 0.5, 0.5);
      Tween.createScaleTween(this, { x: 3, y: 3, z: 3 }, {
        duration: 0.3,
        easing: Tween.Easing.Sinusoidal.InOut,
      }).start();
    });
  }
}