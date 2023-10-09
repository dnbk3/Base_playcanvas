import level1 from "../../../assets/jsons/level1.json";
import level2 from "../../../assets/jsons/level2.json";
import level3 from "../../../assets/jsons/level3.json";
import level4 from "../../../assets/jsons/level4.json";
import level5 from "../../../assets/jsons/level5.json";
import level6 from "../../../assets/jsons/level6.json";
import level7 from "../../../assets/jsons/level7.json";
import level8 from "../../../assets/jsons/level8.json";
import level9 from "../../../assets/jsons/level9.json";
import level10 from "../../../assets/jsons/level10.json";
import level11 from "../../../assets/jsons/level11.json";
import level12 from "../../../assets/jsons/level12.json";
import level13 from "../../../assets/jsons/level13.json";
import level14 from "../../../assets/jsons/level14.json";
import level15 from "../../../assets/jsons/level15.json";
import level16 from "../../../assets/jsons/level16.json";
import level17 from "../../../assets/jsons/level17.json";
import level18 from "../../../assets/jsons/level18.json";
import level19 from "../../../assets/jsons/level19.json";
import level20 from "../../../assets/jsons/level20.json";
import level21 from "../../../assets/jsons/level21.json";
import level22 from "../../../assets/jsons/level22.json";
import level23 from "../../../assets/jsons/level23.json";
import level24 from "../../../assets/jsons/level24.json";
import level25 from "../../../assets/jsons/level25.json";
import level26 from "../../../assets/jsons/level26.json";
import level27 from "../../../assets/jsons/level27.json";
import level28 from "../../../assets/jsons/level28.json";
import level29 from "../../../assets/jsons/level29.json";
import level30 from "../../../assets/jsons/level30.json";
import { DataLocal } from "./dataLocal";
import { Util } from "../../helpers/util";
import { UserData } from "./userData";
export class DataManager{
  static init() {
    this.levelDatas = [];
    this.levelDatas.push(level1);
    this.levelDatas.push(level2);
    this.levelDatas.push(level3);
    this.levelDatas.push(level4);
    this.levelDatas.push(level5);
    this.levelDatas.push(level6);
    this.levelDatas.push(level7);
    this.levelDatas.push(level8);
    this.levelDatas.push(level9);
    this.levelDatas.push(level10);
    this.levelDatas.push(level11);
    this.levelDatas.push(level12);
    this.levelDatas.push(level13);
    this.levelDatas.push(level14);
    this.levelDatas.push(level15);
    this.levelDatas.push(level16);
    this.levelDatas.push(level17);
    this.levelDatas.push(level18);
    this.levelDatas.push(level19);
    this.levelDatas.push(level20);
    this.levelDatas.push(level21);
    this.levelDatas.push(level22);
    this.levelDatas.push(level23);
    this.levelDatas.push(level24);
    this.levelDatas.push(level25);
    this.levelDatas.push(level26);
    this.levelDatas.push(level27);
    this.levelDatas.push(level28);
    this.levelDatas.push(level29);
    this.levelDatas.push(level30);
    this.currentLevel = DataLocal.currentLevel;
    UserData.init();
  }

  static getLevelData() {
    if (this.currentLevel >= this.levelDatas.length) {
      let randomIndex = Util.randomInt(11, this.levelDatas.length - 1);
      return this.levelDatas[randomIndex];
    }
    return this.levelDatas[this.currentLevel - 1];
  }

  static nextLevel() {
    this.currentLevel++;
    DataLocal.currentLevel = this.currentLevel;
    DataLocal.updateCurrentLevelData(this.currentLevel);
  }

  static getEndLevelType() {
    return this.getLevelData().endCardType;
  }
}