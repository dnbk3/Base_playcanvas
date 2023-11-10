import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_PERSPECTIVE } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Game } from "../../game";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { Util } from "../../helpers/util";
import { GameBackground } from "../../template/objects/gameBackground";
import { TutorialScreen } from "../ui/screens/tutorialScreen";

export const PlaySceneEvent = Object.freeze({
  LevelLoaded: "levelLoaded",
});
export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.currentTime = 0;
    this.levelPass = 0;
  }

  create() {
    super.create();
    this.ui.addScreens(
      new TutorialScreen()
    );
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
    this._initialize();

    this.fire(PlaySceneEvent.LevelLoaded);
  }


  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.inputHandler.enabled = false;
    this.addChild(inputHandlerEntity);
  }

  _initialize() {
    this._initInputHandler();
    this._initLight();
    this._initCamera();
    this._initBg();
  }

  pause() {
  }

  resume() {
  }

  _initBg() {
    let topColor = [
      Util.createColor(111, 182, 226),
    ];
    let bottomColor = [
      Util.createColor(131, 225, 173),
    ];
    let textures = []
    for (let i = 0; i < topColor.length; i++) {
      const texWidth = 256;
      const texHeight = 512;
      let texture = new pc.Texture(Game.app.graphicsDevice, {
        width: texWidth,
        height: texHeight,
        format: pc.PIXELFORMAT_R8_G8_B8,
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE
      });
      let pixels = texture.lock();

      var count = 0;
      var result = new pc.Color();

      const topPixelColor = topColor[i];
      const bottomPixelColor = bottomColor[i];

      for (var h = 0; h < texHeight; h++) {
        for (var w = 0; w < texWidth; w++) {

          result.lerp(topPixelColor, bottomPixelColor, h / (texHeight - 1));

          // assign the result color to each texture pixel:
          pixels[count++] = result.r * 255;       // red
          pixels[count++] = result.g * 255;       // green
          pixels[count++] = result.b * 255;       // blue
        }
      }
      texture.unlock();
      textures.push(texture);
    }
    let texture = Util.randomFromList(textures);
    // let asset = AssetLoader.getAssetByKey(texture);
    this.bg = new GameBackground(texture);
    this.bg.setLocalEulerAngles(32, 0, 0);
    this.addChild(this.bg);
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: Util.createColor(0, 0, 0),
      farClip: 1000,
      fov: 60,
      nearClip: 0.1,
      type: PROJECTION_PERSPECTIVE,
      frustumCulling: false,
    });
    // this.mainCamera.setLocalPosition(5, 10, -10);
    // this.mainCamera.setLocalEulerAngles(-30, 180, 0);
    this.mainCamera.setLocalPosition(0, GameConstant.CAMERA_POSITION_Y, GameConstant.CAMERA_POSITION_Z);
    this.mainCamera.setLocalEulerAngles(-32, 180, 0);
    if (GameConstant.DEBUG_CAMERA) {
      this.mainCamera.addComponent("script");
      this.mainCamera.script.create("orbitCamera", {
        attributes: {
          inertiaFactor: 0.3, // Override default of 0 (no inertia)
        },
      });

      this.mainCamera.script.create("orbitCameraInputMouse");
      this.mainCamera.script.create("orbitCameraInputTouch");
      this.player.controller.swipeMovement.disable();
      this.player.controller.move.disable();
    } else {
      this._initCameraController();
    }
  }

  _initCameraController() {

  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: LIGHTTYPE_DIRECTIONAL,
      color: new Color(0, 0, 0),
      castShadows: false,
      shadowDistance: 30,
      shadowResolution: 1024,
      shadowBias: 0.2,
      normalOffsetBias: 0.05,
      intensity: 0.85,
    });
    this.directionalLight.setLocalPosition(2, 30, -2);
    this.directionalLight.setLocalEulerAngles(45, 135, 0);
  }
}