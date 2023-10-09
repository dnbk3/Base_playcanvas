import { Entity, log } from "playcanvas";
import { Debug } from "../../template/debug";
import { Game } from "../../game";

export const AdEvent = Object.freeze({
  AD_STARTED: "adStarted",
  AD_COMPLETED: "adCompleted",
  AD_ERROR    : "adError",
  AD_INIT_STARTED: "adInitStarted",
  AD_INIT_COMPLETED: "adInitCompleted",
  AD_INIT_ERROR: "adInitError",
});
export const AdState = Object.freeze({
  INIT: "init",
  LOADING: "loading",
  LOADED: "loaded",
});

export const AdBannerSize = Object.freeze({
  SIZE1: "300x250",
  SIZE2: "300x600",
  SIZE3: "728x90",
  SIZE4: "970x90"
});

export class AdsManager{
  static init() {
    this.emitter = new Entity();
    this.state = AdState.INIT;
    if (!window.AbigamesSdk) {
      Debug.error("AdsManager", "AbigamesSdk is not defined");
      return;
    }
    this.abiGameSDK = window.AbigamesSdk;
    this.abiGameSDK.init({
      gameId: 'gameId', onStart: () => {
        Debug.log("AdsManager", "Ads is started");
        this.state = AdState.LOADING;
        this.emitter.fire(AdEvent.AD_INIT_STARTED);
      }
    }).then(() => {
      Debug.log("AdsManager", "Ads is initialized");
      this.state = AdState.LOADED;
      this.emitter.fire(AdEvent.AD_INIT_COMPLETED);
     }).catch((err) => { 
       this.emitter.fire(AdEvent.AD_INIT_ERROR);
       Debug.error("AdsManager", err);
    });
  }

  static detectBannerSizeFollowScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width < height) {
      return AdBannerSize.SIZE1;
    } else {
      if (width < 600) {
        return AdBannerSize.SIZE3;
      } else {
        return AdBannerSize.SIZE4;
      }
    }
  }

  static showBanner(elementId, bannerSize = AdBannerSize.SIZE4) {
    this.abiGameSDK.displayBannerAds(bannerSize, elementId);
  }

  static hasAdblock() {
    let hasAdblock = false;
    this.abiGameSDK.hasAdblock().then((prm) => {
      Debug.log("AdsManager", "hasAdblock", prm);
      hasAdblock = prm;
    }).catch((err) => { 
      Debug.error("AdsManager", err);
    });
    return hasAdblock;
  }

  static showVideo(onStart, onFinished, onError) {
    if (this.state !== AdState.LOADED) {
      onError && onError();
      this.onAdError();
      console.log("AdsManager", "Ads is not loaded");
      return;
    }
  
    this.abiGameSDK.displayVideoAds({
      adStarted: () => {
        onStart && onStart();
        this.onAdStarted();
      },
      adFinished: () => {
        onFinished && onFinished();
        this.onAdFinished();
      },
      adError: () => {
        onError && onError();
        this.onAdError();
      },
    });
  }

  // when start video ads disable input and pause game
  // doc: https://static.gamedistribution.com/developer/developers-guidelines.html

  static onAdStarted() {
    Game.pause();
    Game.app.elementInput.enabled = false;
    this.emitter.fire(AdEvent.AD_STARTED);
  }

  static onAdFinished() { 
    Game.app.elementInput.enabled = true;
    Game.resume();
    this.emitter.fire(AdEvent.AD_COMPLETED);
  }

  static onAdError(err) {
    console.error("AdsManager", err);
    this.emitter.fire(AdEvent.AD_ERROR, err);
  }
}