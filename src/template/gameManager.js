import { Debug } from "./debug";
import { Script } from "./systems/script/script";

export const GameManagerEvent = Object.freeze({
  Start: "start",
  Pause: "pause",
  Resume: "resume",
  Lose: "lose",
  Replay: "replay",
  Win: "win",
});

export const GameManager = Script.createScript({
  name: "gameManager",

  start() {
    Debug.log("GameManager", "Start");
    this.fire(GameManagerEvent.Start);
  },

  pause() {
    Debug.log("GameManager", "Pause");
    this.fire(GameManagerEvent.Pause);
  },

  resume() {
    Debug.log("GameManager", "Resume");
    this.fire(GameManagerEvent.Resume);
  },

  lose() {
    Debug.log("GameManager", "Lose");
    this.fire(GameManagerEvent.Lose);
  },

  replay() {
    Debug.log("GameManager", "Replay");
    this.fire(GameManagerEvent.Replay);
  },

  win() {
    Debug.log("GameManager", "Win");
    this.fire(GameManagerEvent.Win);
  },
});
