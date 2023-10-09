import { loadObitCameraPlugin } from "./libs/orbit-camera";
import { AssetLoader } from "./assetLoader/assetLoader";
import { SceneManager } from "./template/scene/sceneManager";
import { GameConstant } from "./gameConstant";
import { InputManager } from "./template/systems/input/inputManager";
import { GameState, GameStateManager } from "./template/gameStateManager";
import { Time } from "./template/systems/time/time";
import { Tween } from "./template/systems/tween/tween";
import { Application, ElementInput, Keyboard, Mouse, TouchDevice, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";
import "./template/extensions/index";
import { Configurator } from "./number-merge/configtor/configtor";
import { PlayScene } from "./number-merge/scenes/playScene";
import { SoundManager } from "./template/soundManager";
import { Physics } from "./physics/physics";
import { DataLocal, DataLocalEvent } from "./number-merge/data/dataLocal";
import { FPSRender } from "./libs/fpsRender";
import { LoadingScene } from "./number-merge/scenes/loadingScene";
import { DataManager } from "./number-merge/data/dataManager";


export class Game {

  static init() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.app = new Application(this.canvas, {
      elementInput: new ElementInput(this.canvas),
      keyboard: new Keyboard(window),
      mouse: new Mouse(this.canvas),
      touch: new TouchDevice(this.canvas),
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    window.addEventListener("resize", () => this.app.resizeCanvas);

    if (GameConstant.DEBUG_FPS) {
      this.debugFPS();
    }
    loadObitCameraPlugin();
    AssetLoader.loadAssets(this.app, () => {
      this.load();
      this.create();
    });
  }

  static debugFPS() {
    FPSRender();
    this.fpsDebug = new FPSMeter();
  }

  static load() {
    InputManager.init(this.app);
    GameStateManager.init(GameState.Tutorial);
    Time.init(this.app);
    Tween.init(this.app);
    Configurator.config(this.app);
    this.app.on(DataLocalEvent.Initialize, () => {
      DataManager.init();
    });
    DataLocal.init();
    Physics.init(this.app);
    this.app.start();
  }

  static create() {
    this.numberBatch = this.app.batcher.addGroup("Number", true, 1000);
    this.sphereBatch = this.app.batcher.addGroup("Sphere", true, 100);
    this.gameCreated = true;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    this.app.resizeCanvas(this.width, this.height);
    SceneManager.init([
      new LoadingScene(),
      new PlayScene(),
    ]);
    SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_LOADING));
    this.sceneLoading = SceneManager.getScene(GameConstant.SCENE_LOADING);
    this.scenePlay = SceneManager.getScene(GameConstant.SCENE_PLAY);
    this.app.on("update", this.update, this);
  }

  static update(dt) {
    SceneManager.update(Time.dt);
    if (GameConstant.DEBUG_FPS) {
      this.fpsDebug.tick();
    }
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      this.width = screenSize.width;
      this.height = screenSize.height;
      this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
      this.app.resizeCanvas(this.width, this.height);
      SceneManager.resize();
      this.app.fire("resize");
    }
  }

  static onStart() {
    GameStateManager.state = GameState.Playing;
  }

  static replay() {
    GameStateManager.state = GameState.Tutorial;
  }

  static setPause(isPause) {
    if (!this.gameCreated) {
      return;
    }

    if (isPause) {
      this.pause();
    }
    else if (GameStateManager.state === GameState.Paused) {
      this.resume();
    }
  }

  static pause() {
    GameStateManager.state = GameState.Paused;
    Time.scale = 0;
    SoundManager.muteAll(true);
    SceneManager.pause();
  }

  static resume() {
    GameStateManager.state = GameStateManager.prevState;
    Time.scale = 1;
    SoundManager.muteAll(false);
    SceneManager.resume();
  }

  static isPortrait() {
    return this.width < this.height;
  }

  static isLandscape() {
    return this.width > this.height;
  }
}

window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef

window.onload = function () {
  Game.init();
}

window.addEventListener("resize", (event) => {
  Game.resize({ width: window.innerWidth, height: window.innerHeight })
});

window.addEventListener("focus", () => {
  Game.setPause(false);
});

window.addEventListener("blur", () => {
  Game.setPause(true);
});

