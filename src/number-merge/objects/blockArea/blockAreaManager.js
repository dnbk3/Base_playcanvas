import { Entity, OrientedBox } from "playcanvas";

export class BlockAreaManager{
  static _instance;

  static get instance() { 
    if (!this._instance) {
      this._instance = new BlockAreaManager();
    }

    return this._instance;
  }

  constructor() {
    this.roadBlockAreaBoxes = [];
    this.wallBlockAreaBoxes = [];
    this.emitter = new Entity();
  }

  addRoadBlockArea(script) {
    this.roadBlockAreaBoxes.push(script);
  }

  addWallBlockArea(script) { 
    this.wallBlockAreaBoxes.push(script);
  }

  getRoadBlockAreaBoxes() { 
    return this.roadBlockAreaBoxes;
  }

  getWallBlockAreaBoxes() { 
    return this.wallBlockAreaBoxes;
  }

  clear() {
    this.roadBlockAreaBoxes = [];
    this.wallBlockAreaBoxes = [];
  }
}