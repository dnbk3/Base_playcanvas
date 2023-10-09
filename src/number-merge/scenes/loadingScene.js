import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_PERSPECTIVE } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { LoadingBarEvent } from "../ui/objects/loadingBar";
import { LoadingScreen } from "../ui/screens/loadingScreen";
import { SceneManager } from "../../template/scene/sceneManager";
import { PlaySceneEvent } from "./playScene";

export class LoadingScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_LOADING);
  }

  create() {
    super.create();
    this.ui.addScreens(new LoadingScreen());
    this.ui.setScreenActive(GameConstant.SCREEN_LOADING);
    this.loadingScreen = this.ui.getScreen(GameConstant.SCREEN_LOADING);
    this.loadingScreen.loadingBar.on(LoadingBarEvent.COMPLETE, this.onLoadingCompleted, this);
    this._initialize();
  }

  _initialize() {
    this._initCamera();
    this._initLight();
  }

  onLoadingCompleted() {
    let scenePlay = SceneManager.getScene(GameConstant.SCENE_PLAY);
    scenePlay.once(PlaySceneEvent.LevelLoaded, () => {
      this.enabled = false;
      SceneManager.removeScene(this);
    });
    SceneManager.loadSceneAddtive(scenePlay);
    scenePlay.create();
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 60,
      nearClip: 0.1,
      type: PROJECTION_PERSPECTIVE
    });
    // this.mainCamera.setLocalPosition(5, 10, -10);
    // this.mainCamera.setLocalEulerAngles(-30, 180, 0);
    this.mainCamera.setLocalPosition(0, 5.625, -6);
    this.mainCamera.setLocalEulerAngles(-32, 180, 0);
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