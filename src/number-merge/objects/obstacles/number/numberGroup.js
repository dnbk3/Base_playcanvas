import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Spawner } from "../../../scripts/spawners/spawner";
import { Number } from "./number";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class NumberGroup extends Entity{
  constructor() {
    super();
    this._initSpawner();
    this.on(SpawningEvent.Spawn, () => {
      this.value = 0;
      this.elements.forEach((element) => { 
        element.fire(SpawningEvent.Despawn);
      });
      this.elements = [];
      this.collider && this.collider.enable();
    });
    this.elements = [];
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.MapObject,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 0, 0),
      scale: new Vec3(0.5 * 1, 1, 0.5),
    });
    this.collider.initialize();
  }

  onCollide() {
    this.collider && this.collider.disable();
    this.fire(SpawningEvent.Despawn);
  }
  
  config(data) { 
    this.value = data.value;
    let valueString = this.value.toString();
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setLocalPosition(pos.x, pos.y, pos.z);
    this.setLocalEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    for (let i = 0; i < valueString.length; i++) {
      var element = valueString[i];
      let number = this.createNumber(element);
      this.addChild(number);
    }
    this.updateSize(valueString);
    this.collider.box.setLocalScale(0.5 * valueString.length, 1, 0.5)
  }

  createNumber(value) {
    let spawner = this.getSpawner(value);
    let number = spawner.spawn();
    this.elements.push(number);
    return number;
  }

  getSpawner(value) {
    let int = parseInt(value);
    switch (int) {
      case 1:
        return this.oneSpawner;
      case 2:
        return this.twoSpawner;
      case 3:
        return this.threeSpawner;
      case 4:
        return this.fourSpawner;
      case 5:
        return this.fiveSpawner;
      case 6:
        return this.sixSpawner;
      case 7:
        return this.sevenSpawner;
      case 8:
        return this.eightSpawner;
      case 9:
        return this.nineSpawner;
      case 0:
        return this.zeroSpawner;
      default:
        return null;
    }
  }

  getMaterial(value) {
    if (value >= this.value) {
      return AssetLoader.getAssetByKey("mat_blue_number").resource;
    }
    return AssetLoader.getAssetByKey("mat_red_number").resource;
  }

  _initSpawner() {
    let oneSpawnerEntity = new Entity("oneSpawner");
    this.addChild(oneSpawnerEntity);
    this.oneSpawner = oneSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [1]
    });
    this.oneSpawner.initialize();
    this.oneSpawner.postInitialize();

    let twoSpawnerEntity = new Entity("twoSpawner");
    this.addChild(twoSpawnerEntity);
    this.twoSpawner = twoSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [2]
    });
    this.twoSpawner.initialize();
    this.twoSpawner.postInitialize();

    let threeSpawnerEntity = new Entity("threeSpawner");
    this.addChild(threeSpawnerEntity);
    this.threeSpawner = threeSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [3]
    });
    this.threeSpawner.initialize();
    this.threeSpawner.postInitialize();

    let fourSpawnerEntity = new Entity("fourSpawner");
    this.addChild(fourSpawnerEntity);
    this.fourSpawner = fourSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [4]
    });
    this.fourSpawner.initialize();
    this.fourSpawner.postInitialize();

    let fiveSpawnerEntity = new Entity("fiveSpawner");
    this.addChild(fiveSpawnerEntity);
    this.fiveSpawner = fiveSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [5]
    });
    this.fiveSpawner.initialize();
    this.fiveSpawner.postInitialize();

    let sixSpawnerEntity = new Entity("sixSpawner");
    this.addChild(sixSpawnerEntity);
    this.sixSpawner = sixSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [6]
    });
    this.sixSpawner.initialize();
    this.sixSpawner.postInitialize();

    let sevenSpawnerEntity = new Entity("sevenSpawner");
    this.addChild(sevenSpawnerEntity);
    this.sevenSpawner = sevenSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [7]
    });
    this.sevenSpawner.initialize();
    this.sevenSpawner.postInitialize();

    let eightSpawnerEntity = new Entity("eightSpawner");
    this.addChild(eightSpawnerEntity);
    this.eightSpawner = eightSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [8]
    });
    this.eightSpawner.initialize();
    this.eightSpawner.postInitialize();

    let nineSpawnerEntity = new Entity("nineSpawner");
    this.addChild(nineSpawnerEntity);
    this.nineSpawner = nineSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [9]
    });
    this.nineSpawner.initialize();
    this.nineSpawner.postInitialize();

    let zeroSpawnerEntity = new Entity("zeroSpawner");
    this.addChild(zeroSpawnerEntity);
    this.zeroSpawner = zeroSpawnerEntity.addScript(Spawner, {
      class: Number,
      poolSize: 10,
      args: [0]
    });
    this.zeroSpawner.initialize();
    this.zeroSpawner.postInitialize();
  }

  updateValue(value) { 
    this.value = value;
    let valueString = this.value.toString();
    for (let i = 0; i < this.elements.length; i++) {
      var element = this.elements[i];
      element.fire(SpawningEvent.Despawn);
    }
    this.elements = [];
    for (let i = 0; i < valueString.length; i++) {
      var element = valueString[i];
      let number = this.createNumber(element);
      this.addChild(number);
    }
    this.updateSize(valueString);
  }

  updateSize(valueString) {
    let targetScale = this.value / 1000 + Math.pow(1.16, valueString.length - 1);
    let scale = Math.min(targetScale, 1.9);
    this.elements.forEach((element, index) => { 
      element.setLocalScale(scale, scale, scale);
      let x = ((valueString.length - 1) * (-scale / 2) / 2);
      element.setLocalPosition(index * (-0.5 * scale) - x, 0, 0);
    });
    return scale;
  }

  updateMaterial(material) {
    for (let i = 0; i < this.elements.length; i++) {
      var element = this.elements[i];
      element.updateMaterial(material);
    }
  }
}