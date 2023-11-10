
import { DataLocal } from "./dataLocal";
import { Util } from "../../helpers/util";
import { UserData } from "./userData";
export class DataManager {
  static init() {
    this.levelDatas = [];

    this.currentLevel = DataLocal.currentLevel;
    UserData.init();
  }

  static getLevelData() {
    if (this.currentLevel >= this.levelDatas.length) {
      let randomIndex = Util.randomInt(11, this.levelDatas.length - 1);
      return this.levelDatas[randomIndex];
    }
    return this.levelDatas[0];
  }

  static nextLevel() {
    this.currentLevel++;
    DataLocal.currentLevel = this.currentLevel;
    DataLocal.updateCurrentLevelData(this.currentLevel);
  }

}