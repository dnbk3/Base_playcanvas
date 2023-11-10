import { Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { UIScreen } from "../../../template/ui/uiScreen"

export const TutorialScreenEvent = Object.freeze({

});


export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);

    this._initFakeBg();
    this._initTutorial();
    this.resize();
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0;
  }

  _initTutorial() {
    this.hand = ObjectFactory.createImageElement("spr_hand", {
      anchor: new Vec4(0.5, 0.45, 0.5, 0.45),
    });
    this.hand.setLocalPosition(-140, -40, 0);
    this.addChild(this.hand);
  }

  resize() {
    super.resize();
  }
}