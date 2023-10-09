import { Color, Entity, LAYERID_UI, LAYERID_WORLD, LIGHTTYPE_DIRECTIONAL, PROJECTION_PERSPECTIVE } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { PlayScreen } from "../ui/screens/playScreen";
import { DataManager } from "../data/dataManager";
import { Level } from "../objects/level/level";
import { Player } from "../objects/player/player";
import { TutorialScreen, TutorialScreenEvent } from "../ui/screens/tutorialScreen";
import { GameState, GameStateManager } from "../../template/gameStateManager";
import { Game } from "../../game";
import { GameManager, GameManagerEvent } from "../../template/gameManager";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { SwipeMovement } from "../scripts/input/swipeMovement";
import { CameraController } from "../scripts/controllers/cameraController";
import { LevelController } from "../scripts/controllers/levelController";
import { PlayerController, PlayerEvent } from "../scripts/controllers/playerController";
import { Tween } from "../../template/systems/tween/tween";
import { SoliderManager, SoliderManagerEvent } from "../manager/soliderManager";
import { Spawner } from "../scripts/spawners/spawner";
import { EatEffect } from "../objects/effects/eatEffect";
import { RedDamageEffect } from "../objects/effects/redDamageEffect";
import { BlueSphereEffect } from "../objects/effects/blueSphereEffect";
import { BloodEffect } from "../objects/effects/bloodEffect";
import { LoseScreen, LoseScreenEvent } from "../ui/screens/loseScreen";
import { WinScreen, WinScreenEvent } from "../ui/screens/winScreen";
import { Util } from "../../helpers/util";
import { GameBackground } from "../../template/objects/gameBackground";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { EndWallEvent } from "../objects/obstacles/wall/endWall";
import { BigBossEvent } from "../objects/boss/bigBoss";
import { RedDamageControllerEvent } from "../scripts/controllers/redDamageController";
import { BlockAreaManager } from "../objects/blockArea/blockAreaManager";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { AdsManager } from "../ads/adsManager";
import { Time } from "../../template/systems/time/time";

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
      new PlayScreen(),
      new TutorialScreen(),
      new WinScreen(),
      new LoseScreen(),
    );
    this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);
    this.tutorialScreen = this.ui.getScreen(GameConstant.SCREEN_TUTORIAL);
    this.loseScreen = this.ui.getScreen(GameConstant.SCREEN_LOSE);
    this.winScreen = this.ui.getScreen(GameConstant.SCREEN_WIN);
    this.tutorialScreen.on(TutorialScreenEvent.OnTapBackground, this._onStart, this);
    this._initialize();
    this._registerLoseScreenEvents();
    this._registerWinScreenEvents();
    this._registerTutorialScreenEvents();
    this._registerPlayScreenEvents();
  }

  _registerPlayScreenEvents() { 
    this.playScreen.on("playEffectComplete", () => {
      this.ui.setScreenActive(GameConstant.SCREEN_WIN);
      this.collectCurrency();
      this.winScreen.play();
    });
  }

  _registerTutorialScreenEvents() {
    this.tutorialScreen.on(TutorialScreenEvent.ButtonStartNumberClicked, () => { 
      this.upgradePlayerStartNumber();
      this.updateUserData();
    });
    this.tutorialScreen.on(TutorialScreenEvent.ButtonIncomeClicked, () => { 
      this.upgradePlayerIncome();
      this.updateUserData();
    });
  }

  upgradePlayerStartNumber() { 
    let currency = UserData.currency;
    let startNumber = UserData.startNumber;
    let money = GameConstant.PLAYER_START_UPGRADE_NUMBER_MONEY * (startNumber - GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP);
    if (currency >= money) {
      UserData.currency -= money;
      UserData.startNumber += GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP;
      DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
      DataLocal.updateDataByKey(GameConstant.INDEXEDDB_START_NUMBER_KEY, UserData.startNumber);
      this.player.updateValue(UserData.startNumber);
      money = GameConstant.PLAYER_START_UPGRADE_NUMBER_MONEY * (UserData.startNumber - GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP);
      this.tutorialScreen.updateStartNumberText(UserData.startNumber, money);
      this.playScreen.updateCurrencyText(Math.ceil(UserData.currency));
      this.player.controller.updateValue(UserData.startNumber);
      this.tutorialScreen.playAnimBtnNumberCount();
    } else {
      AdsManager.showVideo(() => { }, () => {
        UserData.startNumber += GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP;
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_START_NUMBER_KEY, UserData.startNumber);
        this.player.updateValue(UserData.startNumber);
        money = GameConstant.PLAYER_START_UPGRADE_NUMBER_MONEY * (UserData.startNumber - GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP);
        this.tutorialScreen.updateStartNumberText(UserData.startNumber, money);
        this.player.controller.updateValue(UserData.startNumber);
      });
    }
  }

  upgradePlayerIncome() {
    let startIncome = UserData.income;
    let currency = UserData.currency;
    let nextIncome = startIncome + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP;
    let incomeMoney = GameConstant.PLAYER_START_UPGRADE_INCOME_MONEY * ((nextIncome * 10 - GameConstant.PLAYER_START_INCOME * 10));
    if (currency >= incomeMoney) {
      UserData.currency -= incomeMoney;
      UserData.income += (GameConstant.PLAYER_START_UPGRADE_INCOME_STEP * 10) / 10;
      DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
      DataLocal.updateDataByKey(GameConstant.INDEXEDDB_INCOME_KEY, UserData.income);
      nextIncome = UserData.income + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP;
      incomeMoney = GameConstant.PLAYER_START_UPGRADE_INCOME_MONEY * ((nextIncome * 10 - GameConstant.PLAYER_START_INCOME * 10));
      this.tutorialScreen.updateIncomeText(UserData.income, incomeMoney);
      this.playScreen.updateCurrencyText(Math.ceil(UserData.currency));
      this.tutorialScreen.playAnimBtnIncome();
    } else {
      AdsManager.showVideo(() => { }, () => {
        UserData.income += (GameConstant.PLAYER_START_UPGRADE_INCOME_STEP * 10) / 10;
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_INCOME_KEY, UserData.income);
        nextIncome = UserData.income + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP;
        incomeMoney = GameConstant.PLAYER_START_UPGRADE_INCOME_MONEY * ((nextIncome * 10 - GameConstant.PLAYER_START_INCOME * 10));
        this.tutorialScreen.updateIncomeText(UserData.income, incomeMoney);
      })
    }
  }

  _registerLoseScreenEvents() {
    this.loseScreen.on(LoseScreenEvent.ButtonTryAgainClicked, this.replay, this);
  }

  _registerWinScreenEvents() {
    this.winScreen.on(WinScreenEvent.ButtonContinueClicked, this.nextLevel, this);
  }

  _resetAds() {
    this.currentTime = 0;
    this.levelPass = 0;
  }

  replay() {
    let isShow = this._detectShowVideoAds();
    if (isShow) { 
      AdsManager.showVideo(() => { }, () => {
        this._resetAds();
       this._onReplayed();
      } , () => {
      this._onReplayed();
      });
    } else {
      this._onReplayed();
    }
  }

  _onReplayed() {
    Game.replay();
    this.sfxGameLose.stop();
    this.respawnLevel();
  }

  respawnLevel() {
    this.level.reset();
    this.onRespawnLevel();
    let levelData = DataManager.getLevelData();
    this.level.config(levelData);
    this.level.generate(levelData.levelData);
    this.resetCamera();
    this.registerSoliderManagerEvents();
    this.registerLevelEvents();
    this.updateUserData();
    this.reInitPlayer();
  }

  onRespawnLevel() {
    this.musicBg.stop();
    this.ui.disableAllScreens();
    this.playScreen.updateLevelText(DataManager.currentLevel);
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
    this.musicBg.play();
    SoliderManager.instance.clear();
    BlockAreaManager.instance.clear();
    this.cameraController.enable();
  }

  reInitPlayer() {
    let playerPos = DataManager.getLevelData().playerPos;
    this.player.move.disable();
    this.player.controller.updateValue(UserData.startNumber);
    this.player.setLocalPosition(playerPos.x, GameConstant.PLAYER_POS_Y, playerPos.z);
    this.level.controller.onStart();
    this.player.controller.blockAreas = this.level.roadBlockAreas;
    this.player.controller.swipeMovement.blockAreas = this.level.wallBlockAreas;
    this.player.reset();
  }

  resetCamera() {
    this.mainCamera.setLocalPosition(0, GameConstant.CAMERA_POSITION_Y, GameConstant.CAMERA_POSITION_Z);
    this.mainCamera.setLocalEulerAngles(-32, 180, 0);
    this.cameraController.offset = this.mainCamera.getPosition().clone();
  }

  nextLevel() {
    let isShow = this._detectShowVideoAds();
    if (isShow) { 
      AdsManager.showVideo(() => { }, () => {
        this._resetAds();
        console.log("done");
        this._onNextLevel();
      }, () => {
        this._onNextLevel();
      });
    } else {
      this._onNextLevel();
    }
  }

  _onNextLevel() {
    DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
    DataManager.nextLevel();
    Game.replay();
    this.winScreen.stop();
    this.sfxGameWin.stop();
    this.respawnLevel();
  }

  _onGameStateChanged(state, prevState) {
    if (prevState === GameState.Tutorial && state === GameState.Playing) {
      this._onStart();
    }
  }

  _onStart() {
    if (GameConstant.DEBUG_CAMERA) {
      return;
    }
    Game.onStart();
    this.cameraController.enable();
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL, false);
    this.gameManager.start();
    this.player.onStart();
  }

  update(dt) {
    super.update(dt);
    this.currentTime += dt;
  }

  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    // this.inputHandler.enabled = false;
    this.addChild(inputHandlerEntity);
  }

  _initGameManager() {
    let gameManagerEntity = new Entity("game_manager");
    this.addChild(gameManagerEntity);

    this.gameManager = gameManagerEntity.addScript(GameManager);
    this.gameManager.on(GameManagerEvent.Start, this.inputHandler.enable, this.inputHandler);
    this.gameManager.on(GameManagerEvent.Lose, this._onLose, this);
    this.gameManager.on(GameManagerEvent.Lose, this.inputHandler.disable, this.inputHandler);
    this.gameManager.on(GameManagerEvent.Win, this._onWin, this);
    this.gameManager.on(GameManagerEvent.Win, this.inputHandler.disable, this.inputHandler);
  }

  _detectShowVideoAds() {
    let isShow = false;
    if (this.currentTime >= GameConstant.VIDEO_ADS_TIME_APPEAR || this.levelPass > GameConstant.VIDEO_ADS_COUNT_APPEAR) {
      isShow = true;
    } else {
      isShow = false;
    }
    return isShow;
  }

  _onLose() {
    this.levelPass += 1;
    GameStateManager.state = GameState.Lose;
    this.sfxNumberBreak.play();
    this.sfxGameLose.play();
    Tween.createCountTween({
      duration: 1,
      onComplete: () => {
        this.musicBg.volume = 0.5;
        this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
      }
    }).start();
  }

  _onWin() {
    this.levelPass += 1;
    GameStateManager.state = GameState.Win;
    this.sfxGameWin.play();
    this.musicBg.volume = 0.5;
    this.cashOnWin = this.player.controller._value;
    this.playScreen.playEffect(this.cashOnWin, UserData.income);
  }

  collectCurrency() {
    this.playScreen.updateCurrencyText(Math.ceil(UserData.currency));
  }

  _initialize() {
    this._initInputHandler();
    this._initLight();
    this._initAudio();
    this._initGameManager();
    this._initEffects();
    this._initSoliderManager();
    this._initLevel();
    this._initCamera();
    this._initBg();
    this._cacheShader();
  }

  registerSoliderManagerEvents() { 
    this.soliderManager.offAllEvent();
    this.soliderManager.on(SoliderManagerEvent.Lose, () => {
      this._onFightToBigBoss();
      Tween.createCountTween({
        duration: 1,
        onComplete: () => {
          this._onPlayerLose();
        }
      }).start();
    });
    this.soliderManager.on(SoliderManagerEvent.Win, () => {
      this.spawnCashFxToSolider();
      this.sfxGameWin.play();
      // this._onFightToBigBoss();
      // Tween.createCountTween({
      //   duration: 1,
      //   onComplete: () => {
      //   }
      // }).start();
    });

    let cheatIndex1 = 0;
    let cheatIndex2 = 0;
    this.soliderManager.on(SoliderManagerEvent.EnemyRemoved, (solider) => {
      cheatIndex1++;
      let random = Util.randomInt(2, 4);
      if (cheatIndex1 % random === 0) {
        let fx = this.redBloodFxSpawner.spawn(this.level.soliderBoss);
        let pos = solider.getLocalPosition().clone();
        fx.setLocalPosition(pos.x, 1, pos.z);
        fx.play();
      }
    });
    this.soliderManager.on(SoliderManagerEvent.PlayerRemoved, (solider) => {
      cheatIndex2++;
      let random = Util.randomInt(2, 4);
      if (cheatIndex2 % random === 0) {
        let fx = this.blueBloodFxSpawner.spawn(this.level.soliderBoss);
        let pos = solider.getLocalPosition().clone();
        fx.setLocalPosition(pos.x, 1, pos.z);
        fx.play();
      }
    });
  }

  spawnCashFxToSolider() {
    this.soliderManager.soliderPlayers.forEach((solider, index) => {
      const screenPos = this.mainCamera.camera.worldToScreen(solider.getPosition());
      UserData.currency += 1;
      this.playScreen.spawnCash(screenPos);
      if (index >= this.soliderManager.soliderPlayers.length - 1) {
        this.collectCurrency();
        Tween.createCountTween({
          duration: 2,
          onComplete: () => {
            this.ui.setScreenActive(GameConstant.SCREEN_WIN);
            this.winScreen.play();
          }
        }).start();
      }
     });
  }

  _initAudio() {
    this.gameAudioEntity = new Entity();
    this.addChild(this.gameAudioEntity);
    this.gameAudioEntity.addComponent("sound");
    this.musicBg = this.gameAudioEntity.sound.addSlot("music_bg", {
      asset: AssetLoader.getAssetByKey("music_bg"),
      pitch: 1,
      loop: true,
      autoPlay: false,
    });
    this.musicBg.play();

    this.sfxCollectItem = this.gameAudioEntity.sound.addSlot("sfx_collect_item", {
      asset: AssetLoader.getAssetByKey("sfx_collect_item"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });

    this.sfxNumberBreak = this.gameAudioEntity.sound.addSlot("sfx_number_break", {
      asset: AssetLoader.getAssetByKey("sfx_number_break"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });

    this.sfxGameLose = this.gameAudioEntity.sound.addSlot("sfx_game_lose", {
      asset: AssetLoader.getAssetByKey("sfx_game_lose"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
    this.sfxGameWin = this.gameAudioEntity.sound.addSlot("sfx_game_win", {
      asset: AssetLoader.getAssetByKey("sfx_game_win"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });

    this.sfxWallBreak = this.gameAudioEntity.sound.addSlot("sfx_wall_break", {
      asset: AssetLoader.getAssetByKey("sfx_wall_break"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
    this.sfxRedDamageTick = this.gameAudioEntity.sound.addSlot("sfx_redDamage_tick", {
      asset: AssetLoader.getAssetByKey("sfx_redDamage_tick"),
      pitch: 1,
      loop: false,
      autoPlay: false,
      overlap: true,
    });
    this.sfxGameFall = this.gameAudioEntity.sound.addSlot("sfx_game_fall", {
      asset: AssetLoader.getAssetByKey("sfx_game_fall"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
    this.sfxObstacleImpact = this.gameAudioEntity.sound.addSlot("sfx_game_obstacles_impact", {
      asset: AssetLoader.getAssetByKey("sfx_game_obstacles_impact"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
    this.sfxWallImpact = this.gameAudioEntity.sound.addSlot("sfx_wall_impact", {
      asset: AssetLoader.getAssetByKey("sfx_game_wall_impact"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
    this.sfxJump = this.gameAudioEntity.sound.addSlot("sfx_jump", {
      asset: AssetLoader.getAssetByKey("sfx_jump"),
      pitch: 1,
      loop: false,
      autoPlay: false,
    });
  }

  pause() {
    this.gameManager?.pause();
    this.musicBg.pause();
  }

  resume() {
    this.gameManager?.resume();
    this.musicBg.resume();
  }

  _cacheShader() {
    let cacheEntity = new Entity();
    cacheEntity.setLocalPosition(0, 0, 50);
    this.addChild(cacheEntity);

    let fx2 = this.redBloodFxSpawner.spawnAt(cacheEntity);
    fx2.play();
    let fx1 = this.blueBloodFxSpawner.spawnAt(cacheEntity);
    fx1.play();
    this.eatEffect.playAt(cacheEntity);
    this.eatEffect.updateSizeAura(1);
    this.redDamageEffect.playAt(cacheEntity);
    this.blueSphereFx.playAt(cacheEntity);
    this._cheatLoadLevel();
  }

  _cheatLoadLevel() {
    this._onLevelLoaded();
    this.level.controller.onStart();
    this.tutorialScreen.play();
  }

  _initEffects() {
    let redBloodFxSpawnerEntity = new Entity("redBloodFxSpawnerEntity");
    this.addChild(redBloodFxSpawnerEntity);
    this.redBloodFxSpawner = redBloodFxSpawnerEntity.addScript(Spawner, {
      class: BloodEffect,
      args: [[220, 0, 0]],
      poolSize: 10,
    });

    let blueBloodFxSpawnerEntity = new Entity("blueBloodFxSpawnerEntity");
    this.addChild(blueBloodFxSpawnerEntity);
    this.blueBloodFxSpawner = blueBloodFxSpawnerEntity.addScript(Spawner, {
      class: BloodEffect,
      args: [[0, 0, 220]],
      poolSize: 10,
    });

    this.redDamageEffect = new RedDamageEffect();
    this.addChild(this.redDamageEffect);

    this.blueSphereFx = new BlueSphereEffect();
    this.addChild(this.blueSphereFx);

    this.eatEffect = new EatEffect();
    this.addChild(this.eatEffect);
  }

  _initSoliderManager() {
    this.soliderManager = SoliderManager.instance;
    this.addChild(this.soliderManager);
    this.registerSoliderManagerEvents();
  }

  registerLevelEvents() { 
    this.level.redDamages.forEach(redDmg => {
      redDmg.off(RedDamageControllerEvent.Hit, this._onRedDamageDestroy, this);
      redDmg.once(RedDamageControllerEvent.Hit, this._onRedDamageDestroy, this);
    })
    this.level.walls.forEach(wall => {
      wall.on(EndWallEvent.Break, () => {
        this.sfxWallBreak.play();
      });
    });
    if (this.level.bigBoss) {
      this.level.bigBoss.on(BigBossEvent.Break, () => {
        this.sfxWallImpact.play();
      });
    }
  }

  _initLevel() {
    let levelData = DataManager.getLevelData();
    this.level = new Level();
    this.addChild(this.level);
    this.level.config(levelData);
    this.level.generate(levelData.levelData);
    this.registerLevelEvents();
    this._initPlayer();
    this.level.controller = this.level.addScript(LevelController, {
      player: this.player,
    });
    this.playScreen.updateLevelText(DataManager.currentLevel);
    this.playScreen.updateCurrencyText(Math.ceil(UserData.currency));

    this.updateUserData();
    this.player.controller.updateValue(UserData.startNumber);
  }

  updateUserData() {
    let startNumber = UserData.startNumber;
    let money = GameConstant.PLAYER_START_UPGRADE_NUMBER_MONEY * (startNumber - GameConstant.PLAYER_START_UPGRADE_NUMBER_STEP);
    this.tutorialScreen.updateStartNumberText(startNumber, money);

    let startIncome = UserData.income;
    let nextIncome = startIncome + GameConstant.PLAYER_START_UPGRADE_INCOME_STEP;
    let incomeMoney = GameConstant.PLAYER_START_UPGRADE_INCOME_MONEY * ((nextIncome - GameConstant.PLAYER_START_INCOME) * 10);
    this.tutorialScreen.updateIncomeText(startIncome, incomeMoney);
  }

  _onLevelLoaded() {
    this.fire(PlaySceneEvent.LevelLoaded);
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
    // AdsManager.showBanner();
    // AdsManager.showVideo();
  }
  
  _onRedDamageDestroy(redDmg) {
    this.redDamageEffect.playAt(redDmg);
  }

  _initPlayer() {
    this.player = new Player();
    let playerPos = DataManager.getLevelData().playerPos;
    this.player.setLocalPosition(playerPos.x, GameConstant.PLAYER_POS_Y, playerPos.z);
    this.addChild(this.player);
    let swipeMovement = this.player.addScript(SwipeMovement, {
      screenEntity: this.playScreen,
      multiplier: GameConstant.SWIPE_MULTIPLIER,
      speed: GameConstant.PLAYER_SPEED,
      range: GameConstant.PLAYER_LIMIT_X,
      blockAreas: this.level.wallBlockAreas,
      collider: this.player.collider,
    });
    this.player.controller = this.player.addScript(PlayerController, {
      collider: this.player.collider,
      swipeMovement: swipeMovement,
      soliderSpawner: this.player.soliderSpawner,
      blockAreas: this.level.roadBlockAreas,
      move: this.player.move,
    });
    this.player.controller.on(PlayerEvent.Fall, () => {
      this.sfxGameFall.play();
      this._onPlayerLose();
    });
    this.player.controller.on(PlayerEvent.Lose, () => {
      this._onPlayerLose();
      this._shakeCamera();
    });
    this.player.controller.on(PlayerEvent.Win, this._onPlayerWin, this);
    this.player.controller.on(PlayerEvent.Hit, this._onPlayerHitNumber, this);
    this.player.controller.on(PlayerEvent.HitRedDamage, this._onPlayerHitRedDamage, this);
    this.player.controller.on(PlayerEvent.HitObstacle, this._onPlayerHitObstacle, this);
    this.player.controller.on(PlayerEvent.HitSawBlade, this._onPlayerHitSawBlade, this);
    this.player.controller.on(PlayerEvent.Jump, this._onPlayerJump, this);
    this.player.controller.on(PlayerEvent.HitFinishLine, this._onHitFinishLine, this);
    this.player.controller.on(PlayerEvent.FightToBigBoss, this._onFightToBigBoss, this);
    this.player.controller.on(PlayerEvent.MoveToSoliderBoss, this._onMoveToSoliderBoss, this);

    this.inputHandler.on(InputHandlerEvent.PointerDown, swipeMovement.onPointerDown, swipeMovement);
    this.inputHandler.on(InputHandlerEvent.PointerMove, swipeMovement.onPointerMove, swipeMovement);
    this.inputHandler.on(InputHandlerEvent.PointerUp, swipeMovement.onPointerUp, swipeMovement);
  }

  _onPlayerJump() {
    this.sfxJump.play();
  }

  _onMoveToSoliderBoss() {
    Tween.createTween(this.cameraController.offset, { z: "+1", y: "+5" }, {
      duration: 1,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
    Tween.createRotateTween(this.mainCamera, { x: "-20" }, {
      duration: 1,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
  }

  _onFightToBigBoss() {
    Tween.createTween(this.cameraController.offset, { z: "+6", y: "-8" }, {
      duration: 1,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
    Tween.createRotateTween(this.mainCamera, { x: "+10" }, {
      duration: 1,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
  }

  _shakeCamera() { 
    Tween.createLocalTranslateTween(this.mainCamera, { x: "+0.5", y: "+0.5" }, {
      duration: 0.07,
      easing: Tween.Easing.Sinusoidal.InOut,
      repeat: 3,
      yoyo: true,
    }).start();
  }

  _onHitFinishLine() {
    Tween.createTween(this.cameraController.offset, { z: "-5", y: "+5" }, {
      duration: 1,
      easing: Tween.Easing.Sinusoidal.InOut
    }).start();
  }

  _onPlayerHitObstacle() {
    this.sfxObstacleImpact.play();
  }

  _onPlayerHitSawBlade() {
    this.sfxNumberBreak.volume = 0.7;
    this.sfxNumberBreak.play();
    this.blueSphereFx.playAt(this.player);
  }

  _onPlayerHitNumber(number) {
    let scale = this.player.number.elements[0].getLocalScale();
    this.eatEffect.updateSizeAura(scale.x);
    this.eatEffect.playAt(this.player);
    this.sfxCollectItem.play();
  }

  _onPlayerHitRedDamage(redDmg) { 
    this.blueSphereFx.playAt(this.player);
    this.sfxRedDamageTick.play();
  }

  _onPlayerLose() {
    this.cameraController.disable();
    this.gameManager.lose();
  }

  _onPlayerWin() {
    this.cameraController.disable();
    this.gameManager.win();
  }

  _initBg() {
    let topColor = [
      Util.createColor(111, 182, 226),
    ];
    let bottomColor = [
      Util.createColor(131, 225, 173),
    ];
    let textures = []
    for(let i = 0; i < topColor.length; i++) {
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
    this.cameraController = this.mainCamera.addScript(CameraController, {
      target: this.player,
      speed: 3,
      offset: this.mainCamera.getPosition().clone(),
      limitX: GameConstant.CAMERA_LIMIT_X,
    });
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