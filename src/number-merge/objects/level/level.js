import { Entity, Vec3 } from "playcanvas";
import { ObjectType } from "./objectType";
import { Spawner } from "../../scripts/spawners/spawner";
import { Road } from "./road";
import { NumberGroup } from "../obstacles/number/numberGroup";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { FinishLine } from "./finishLine";
import { Util } from "../../../helpers/util";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { GameConstant } from "../../../gameConstant";
import { BigBoss } from "../boss/bigBoss";
import { SoliderBoss } from "../boss/soliderBoss";
import { RedDamage } from "../obstacles/redDamage/redDamage";
import { Wall } from "../obstacles/wall/wall";
import { EndWall } from "../obstacles/wall/endWall";
import { MathOperator, MathWall } from "../obstacles/mathWall/mathWall";
import { Jump } from "../obstacles/jump/jump";
import { SawBlade } from "../obstacles/sawBlade/sawBlade";
import { SawBladeMove } from "../obstacles/sawBlade/sawBaldeMove";
import { AreaBox } from "../blockArea/areaBox";

export const LevelEndGameType = Object.freeze({
  Normal: "normal",
  BigBoss: "bigBoss",
  SoliderBoss: "soliderBoss",
});

export class Level extends Entity{
  constructor() {
    super();
    this._initMaterial();
    this._initSpawner();
    this.numbers = [];
    this.roads = [];
    this.redDamages = [];
    this.walls = [];
    this.bigBoss = null;
    this.roadBlockAreas = [];
    this.wallBlockAreas = [];
  }

  createWallBlockArea(wall) {
    let areaBox = this.blockAreaSpawner.spawn();
    wall.addChild(areaBox);
    areaBox.config({
      pos: new Vec3(0, 1, 0),
      scale: new Vec3(8.2, 2, 0.4),
      rot: new Vec3(),
    });
    this.wallBlockAreas.push(areaBox);
  }

  createRoadBlockArea(road) {
    let areaBox = this.blockAreaSpawner.spawn();
    road.addChild(areaBox);
    areaBox.config({
      pos: new Vec3(),
      scale: new Vec3(7.425, 2.2, 6),
      rot: new Vec3(),
    });
    this.roadBlockAreas.push(areaBox);
  }

  reset() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      let obj = this.children[i];
      obj.fire(SpawningEvent.Despawn, obj);
    }
    this.numbers = [];
    this.roads = [];
    this.redDamages = [];
    this.walls = [];
    this.bigBoss = null;
    this.soliderBoss = null;
    this.wallBlockAreas = [];
    this.roadBlockAreas = [];
  }

  _initMaterial() {
    this.redMat = AssetLoader.getAssetByKey("mat_red_wall").resource;
    this.greenMat = AssetLoader.getAssetByKey("mat_green_wall").resource;
    this.listMatNormal = [
      AssetLoader.getAssetByKey("mat_1_wall").resource,
      AssetLoader.getAssetByKey("mat_2_wall").resource,
      AssetLoader.getAssetByKey("mat_3_wall").resource,
      AssetLoader.getAssetByKey("mat_4_wall").resource,
      AssetLoader.getAssetByKey("mat_5_wall").resource,
      AssetLoader.getAssetByKey("mat_6_wall").resource,
      AssetLoader.getAssetByKey("mat_7_wall").resource,
      AssetLoader.getAssetByKey("mat_8_wall").resource,
      AssetLoader.getAssetByKey("mat_9_wall").resource,
      AssetLoader.getAssetByKey("mat_10_wall").resource,
    ];
  }

  config(levelData) {
    this.bossValue = levelData.bossValue;
    this.wallCount = levelData.wallCount;
    this.targetDamage = levelData.targetDamage;
    this.endCardType = levelData.endCardType;
    this.firstOffset = 16;
    this.distanceBetweenEndWall = 20;
    this.endPathPoint = new Vec3(0, 0, 0);
  }

  generate(levelData) {
    for (let i = 0; i < levelData.length; i++) {
      const data = levelData[i];
      let obj = null;
      switch (data.tp) { 
        case ObjectType.ROAD:
          obj = this.roadSpawner.spawn();
          obj.config(data);
          this.createRoadBlockArea(obj, data);
          this.roads.push(obj);
          break;
        case ObjectType.NUMBER:
          obj = this.numberSpawner.spawn();
          // obj.on(SpawningEvent.Despawn, () => { 
          //   this.numbers.splice(this.numbers.indexOf(obj), 1);
          // });
          this.numbers.push(obj);
          obj.config(data);
          break;
        case ObjectType.FINISH_LINE:
          obj = this.createFinishLine();
          obj.config(data);
          this.endPathPoint.set(0, 0, data.pos.z);
          break;
        case ObjectType.WALL:
          obj = this.wallSpawner.spawn();
          obj.config(data);
          this.createWallBlockArea(obj);
          break;
        case ObjectType.RED_DAMAGE:
          obj = this.redDamageSpawner.spawn();
          this.redDamages.push(obj);
          obj.config(data);
          break;
        case ObjectType.MATH_WALL:
          obj = this.mathWallSpawner.spawn();
          this.walls.push(obj.leftWall);
          this.walls.push(obj.rightWall);
          obj.config(data);
          break;
        case ObjectType.JUMP:
          obj = this.jumpSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.SAW_BLADE:
          obj = this.sawBladeSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.SAW_BLADE_MOVE:
          obj = this.sawBladeMoveSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.END_WALL:
          obj = this.spawnEndWall(data);
          break;
        default: {
          obj = new Entity();
          break;
        }
      }
      this.addChild(obj);
    }

    this.generateEndWalls();
  }

  spawnEndWall(data) {
    let endWall = this.endWallSpawner.spawn();
    let mat = null;
    let value = this.getEndWallValue(data.value);
    let operator = this.getEndWallOperator(data.value);
    if (operator === MathOperator.SUB || operator === MathOperator.DIV) {
      mat = this.redMat;
    } else {
      mat = this.greenMat;
    }
    let wallConfig = {
      position: new Vec3(data.pos.x, data.pos.y, data.pos.z),
      rot: new Vec3(0, 0, 0),
      size: new Vec3(data.scale.x, data.scale.y, data.scale.z),
      material: mat,
      value: value,
    }
    endWall.config(wallConfig, operator);
    this.walls.push(endWall);
    return endWall;
  }

  getEndWallOperator(value) {
    let operator = value.substring(0, 1);
    return operator;
  }

  getEndWallValue(value) {
    let val = value.substring(1, value.length);
    return parseInt(val);
  }

  generateEndWalls() {
    var rightPos = new Vec3(1, 0, 0);
    var position = Vec3.ZERO;
    var forward = new Vec3(0, 0, 1);
    var baseHealth = Math.floor(this.targetDamage / this.wallCount);
    if (this.endCardType === LevelEndGameType.BigBoss || this.endCardType === LevelEndGameType.SoliderBoss) {
      for (let i = 0; i < this.wallCount; i++) {
        var tmp1 = forward.clone().scale(this.firstOffset);
        var tmp2 = forward.clone().scale(this.distanceBetweenEndWall * i);
        position = this.endPathPoint.clone().add(tmp1).add(tmp2);
        var leftPosition = position.clone().add(rightPos.clone().scale(-2));
        var rightPosition = position.clone().add(rightPos.clone().scale(2));
        var leftValue = Util.randomInt(baseHealth * 0.5, baseHealth * 1.5);
        var rightValue = Util.randomInt(baseHealth * 0.5, baseHealth * 1.5);
        var leftMat = leftValue > rightValue ? this.redMat : this.greenMat;
        var rightMat = leftValue > rightValue ? this.greenMat : this.redMat;
        let size = new Vec3(3.2, 3, 0.1);
        let rot = new Vec3(12, 0, 0);
        let leftWall = this.endWallSpawner.spawn();
        let rightWall = this.endWallSpawner.spawn();
        leftWall.config({
          position: leftPosition,
          material: leftMat,
          value: leftValue,
          size,
          rot
        });

        rightWall.config({
          position: rightPosition,
          material: rightMat,
          value: rightValue,
          size,
          rot
        });
        this.walls.push(leftWall);
        this.walls.push(rightWall);
        this.addChild(leftWall);
        this.addChild(rightWall);
      }
    }

    if (this.endCardType === LevelEndGameType.Normal) {
      for (var i = 0; i < 30; i++)
      {
        position = this.endPathPoint.clone().add(forward.clone().scale(this.firstOffset)).add(forward.clone().scale(this.distanceBetweenEndWall * i));
        
        let value = (i + 1) * 100;
        var endWall = this.endWallSpawner.spawn();
        var mat = this.listMatNormal[i % 10];
        let size = new Vec3(6, 4, 0.1);
        let rot = new Vec3(12, 0, 0);
        endWall.config({
          position: position,
          material: mat,
          value,
          size,
          rot
        });
        this.walls.push(endWall);
        this.addChild(endWall);
      }
    }

    this.maxDistanceFromEndPath = position.clone().sub(this.endPathPoint).length();
    this.generateEndRoads();
  }

  generateEndRoads() {
    var distanceBetweenRoad = GameConstant.DISTANCE_BETWEEN_ROAD;
    let forward = new Vec3(0, 0, 1);
    let roadEndPosition = this.roads[this.roads.length - 1].getLocalPosition().clone();
    for (let i = 1; i < 300; i++){
      let spawnPos = roadEndPosition.clone().add(forward.clone().scale(distanceBetweenRoad * i));
      if (spawnPos.clone().sub(this.endPathPoint).length() < this.maxDistanceFromEndPath + GameConstant.END_ROAD_BONUS) {
        let road = this.roadSpawner.spawn();
        let data = {
          pos: spawnPos,
          rot: new Vec3(0, 0, 0),
          scale: new Vec3(1, 1, 1),
        };
        road.config(data);
        this.createRoadBlockArea(road);
        this.roads.push(road);
        this.addChild(road);
      } else {
        if (this.endCardType !== LevelEndGameType.Normal) { 
          let bossPos = roadEndPosition.clone().add(forward.clone().scale(distanceBetweenRoad * i - 1));
          if (this.endCardType === LevelEndGameType.BigBoss) {
            let bigBoss = this.createBigBoss();
            let rot = new Vec3(0, 0, 0);
            let scale = new Vec3(1, 1, 1);
            let data = {
              pos: bossPos,
              rot,
              scale,
              value: this.bossValue,
            }
            bigBoss.config(data);
            this.addChild(bigBoss);
          } else {
            let soliderBoss = this.createSoliderBoss();
            let rot = new Vec3(0, 0, 0);
            let scale = new Vec3(1, 1, 1);
            let data = {
              pos: bossPos,
              rot,
              scale,
              value: this.bossValue,
            }
            soliderBoss.config(data);
            this.addChild(soliderBoss);
          }
        }
        break;
      }
    }
  }

  createFinishLine() { 
    let finishLine = this.finishLineSpawner.spawn();
    return finishLine;
  }

  createBigBoss() {
    let bigBoss = this.bigBossSpawner.spawn();
    this.bigBoss = bigBoss;
    return bigBoss;
  }

  createSoliderBoss() {
    let solider = this.soliderBossSpawner.spawn();
    this.soliderBoss = solider;
    return solider;
  }

  _initSpawner() {
    let roadSpawnerEntity = new Entity("road-spawner");
    this.addChild(roadSpawnerEntity);
    this.roadSpawner = roadSpawnerEntity.addScript(Spawner, {
      class: Road,
      poolSize: 10,
    });

    let numberSpawnerEntity = new Entity("number-spawner");
    this.addChild(numberSpawnerEntity);
    this.numberSpawner = numberSpawnerEntity.addScript(Spawner, {
      class: NumberGroup,
      poolSize: 10,
    });

    let endWallSpawnerEntity = new Entity("end-wall-spawner");
    this.addChild(endWallSpawnerEntity);
    this.endWallSpawner = endWallSpawnerEntity.addScript(Spawner, {
      class: EndWall,
      poolSize: 10,
    });

    let wallSpawnerEntity = new Entity("wall-spawner");
    this.addChild(wallSpawnerEntity);
    this.wallSpawner = wallSpawnerEntity.addScript(Spawner, {
      class: Wall,
      poolSize: 2,
    });

    let redDamageSpawnerEntity = new Entity("red-damage-spawner");
    this.addChild(redDamageSpawnerEntity);
    this.redDamageSpawner = redDamageSpawnerEntity.addScript(Spawner, {
      class: RedDamage,
      poolSize: 2,
    });

    let mathWallSpawnerEntity = new Entity("math-wall-spawner");
    this.addChild(mathWallSpawnerEntity);
    this.mathWallSpawner = mathWallSpawnerEntity.addScript(Spawner, {
      class: MathWall,
      poolSize: 2,
    });

    let jumpSpawnerEntity = new Entity("jump-spawner");
    this.addChild(jumpSpawnerEntity);
    this.jumpSpawner = jumpSpawnerEntity.addScript(Spawner, {
      class: Jump,
      poolSize: 2,
    });

    let sawBladeSpawnerEntity = new Entity("saw-blade-spawner");
    this.addChild(sawBladeSpawnerEntity);
    this.sawBladeSpawner = sawBladeSpawnerEntity.addScript(Spawner, {
      class: SawBlade,
      poolSize: 5,
    });

    let sawBladeMoveSpawnerEntity = new Entity("saw-blade-move-spawner");
    this.addChild(sawBladeMoveSpawnerEntity);
    this.sawBladeMoveSpawner = sawBladeMoveSpawnerEntity.addScript(Spawner, {
      class: SawBladeMove,
      poolSize: 5,
    });

    let finishLineSpawnerEntity = new Entity("finish-line-spawner");
    this.addChild(finishLineSpawnerEntity);
    this.finishLineSpawner = finishLineSpawnerEntity.addScript(Spawner, {
      class: FinishLine,
      poolSize: 5,
    });

    let bigBossSpawnerEntity = new Entity("big-boss-spawner");
    this.addChild(bigBossSpawnerEntity);
    this.bigBossSpawner = bigBossSpawnerEntity.addScript(Spawner, {
      class: BigBoss,
      poolSize: 5,
    });

    let soliderBossSpawnerEntity = new Entity("solider-boss-spawner");
    this.addChild(soliderBossSpawnerEntity);
    this.soliderBossSpawner = soliderBossSpawnerEntity.addScript(Spawner, {
      class: SoliderBoss,
      poolSize: 5,
    });

    let blockAreaSpawnerEntity = new Entity("block-spawner");
    this.addChild(blockAreaSpawnerEntity);
    this.blockAreaSpawner = blockAreaSpawnerEntity.addScript(Spawner, {
      class: AreaBox,
      poolSize: 5,
    });
  }
}