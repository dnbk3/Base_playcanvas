import { CollisionEvent } from "../../../physics/collissionEvent";
import { Script } from "../../../template/systems/script/script";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../template/systems/tween/tween";
import { Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { SoliderManager } from "../../manager/soliderManager";
import { SpawningEvent } from "../spawners/spawningEvent";
import { MathOperator } from "../../objects/obstacles/mathWall/mathWall";
import { DataManager } from "../../data/dataManager";
import { LevelEndGameType } from "../../objects/level/level";
import { NumberBreak } from "../../objects/obstacles/number/numberBreak";
import { BlockAreaManager } from "../../objects/blockArea/blockAreaManager";
import { UserData } from "../../data/userData";

export const PlayerState = Object.freeze({
  Idle: "idle",
  Move: "move",
  Jump: "jump",
  Fall: "fall",
  Die: "die",
  Attack: "attack",
  Win: "win",
  Lose: "lose",
});

export const PlayerEvent = Object.freeze({
  Win: "win",
  Fall: "fall",
  Lose: "lose",
  Eat: "eat",
  Hit: "hit",
  HitRedDamage: "hitreddamage",
  HitObstacle: "hitobstacle",
  HitSawBlade: "hitsawblade",
  Jump: "jump",
  HitFinishLine: "hitfinishline",
  FightToBigBoss: "fighttobigboss",
  MoveToSoliderBoss: "movetosoliderboss",
  FightToSoliderBoss: "fighttosoliderboss",
});

export const PlayerController = Script.createScript({
  name: "playerController",
  attributes: {
    move: { default: null },
    collider: { default: null },
    swipeMovement: { default: null },
    soliderSpawner: { default: null },
    blockAreas: { default: [] },
  },

  initialize() { 
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.collider.on(CollisionEvent.NotCollide, this.notCollide, this);
    this.reset();
  },

  reset() {
    this.breaks?.forEach((element) => { 
      element.destroy();
    });
    if (this.swipeMovement) {
      this.swipeMovement.enable();
      this.swipeMovement.reset();
    }
    this.breaks = [];
    this._value = this.entity.value;
    this.soliders?.forEach((element) => { 
      element.fire(SpawningEvent.Despawn);
    });
    this.soliders = [];
    this.speed = GameConstant.GAME_SPEED;
    this.tweenIncreaseSpeed?.stop();
    this.state = PlayerState.Idle;
  },

  update() {
    if (this.state === PlayerState.Idle || this.state === PlayerState.Die || this.state === PlayerState.Jump || this.state === PlayerState.Win || this.state === PlayerState.Lose) {
      return;
    }
    if (this.numberGroupMoveSimulator()) {
      if (this.state !== PlayerState.Attack) { 
        this.move.speed.set(0, 0, this.speed);
      }
    } else {
      this.move.speed.set(0, -this.speed, this.speed);
      this.state = PlayerState.Fall;
      this.onFall();
    }
  },

  numberGroupMoveSimulator() {
    let nums = this.entity.number.elements;
    let count = 0;
    let check = false;
    for (let i = 0; i < nums.length; i++) { 
      let pos = nums[i].getPosition();
      let isInsideRoad = this._insideRoads(pos);
      if (!isInsideRoad) {
        pos.y = GameConstant.PLAYER_POS_Y_DOWN;
        nums[i].setPosition(pos);
        count++;
        check = false;
      } else {
        pos.y = GameConstant.PLAYER_POS_Y;
        nums[i].setPosition(pos);
        check = true;
      }
    }
    if(count >= nums.length) {
      check = false;
    } else {
      check = true;
    }

    return check;
  },

  collisionWallSimulation(wall) {
    // wall.disable();
    let pos = this.entity.getPosition();
    let nums = this.entity.number.elements;
    let wallPos = wall.entity.parent.getPosition().clone();
    let wallSize = wall.entity.parent.getLocalScale().clone();
    let isLeft = pos.x > wallPos.x;
    let isRight = pos.x < wallPos.x;
    if (isLeft) {
      pos.x += nums.length * 0.25 * wallSize.z;
    }
    if(isRight) {
      pos.x -= nums.length * 0.25 * wallSize.z;
    }
    this.entity.setPosition(pos);
  },

  onCollide(other) {
    if (other.tag === CollisionTag.MapObject) {
      this.onCollideNumber(other);
    } else if (other.tag === CollisionTag.EndWall) {
      this.onCollideEndWall(other);
    } else if (other.tag === CollisionTag.BigBossStart) {
      this.moveToBigBoss(other);
    } else if(other.tag === CollisionTag.Boss) {
      this.fightBigBoss(other);
    } else if (other.tag === CollisionTag.SoliderBossStart) {
      this.moveToSoliderBoss(other);
    } else if(other.tag === CollisionTag.HeadWall) {
      this.collisionWallSimulation(other);
    } else if(other.tag === CollisionTag.RedDamage) {
      this.onCollideRedDamage(other);
    } else if (other.tag === CollisionTag.Jump) {
      this.jump(other);
    } else if (other.tag === CollisionTag.SawBlade) {
      this.onCollideSawBlade(other);
    } else if (other.tag === CollisionTag.FinishLine) {
      this.onCollideFinishLine(other);
    }
  },

  onCollideNumber(other) {
    if (this._value >= other.entity.value) {
      this._value += other.entity.value;
      this.eat(other.entity);
      this.entity.onEat();
      this.fire(PlayerEvent.Hit, other.entity);
    } else {
      this.onDie();
      other.disable();
    }
  },

  onCollideEndWall(other) { 
    if (this.state === PlayerState.Win) {
      other.disable();
      if (this._value <= other.entity.value) {
        this.move.disable();
        this.fire(PlayerEvent.HitObstacle);
        this.tweenIncreaseSpeed?.stop();
        this.onWinWhenFightBigBoss();
      } else {
        other.entity.onCollide();
      }
    } else {
      this.calculateByOperator(other);
      if (this._value > 0) {
        this.eat(other.entity);
      } else {
        this.onDie();
        other.disable();
      }
    }
  },

  onCollideFinishLine(other) { 
    other.disable();
    let endType = DataManager.getEndLevelType();
    this.fire(PlayerEvent.HitFinishLine);
    this.speed = GameConstant.GAME_SPEED * 3;
    switch (endType) { 
      case LevelEndGameType.BigBoss:
        break;
      case LevelEndGameType.SoliderBoss:
        break;
      default:
        this.state = PlayerState.Win;
        Tween.createLocalTranslateTween(this.entity, { x: 0 }, {
          duration: 1,
        }).start();
        this.swipeMovement.disable();
        break;
    }
    this.tweenIncreaseSpeed = Tween.createCountTween({
      duration: 1,
      loop: true,
      onUpdate: () => {
        this.speed += 0.1;
        this.move.speed.set(0, 0, this.speed);
      }
    }).start();
  },

  onCollideSawBlade(other) {
    this._value -= other.entity.parent.controller.damage;
    this.fire(PlayerEvent.HitSawBlade);
    if (this._value <= 0) { 
      this.onDie();
    } else {
      this.eat(other.entity.parent);
    }
  },

  calculateByOperator(other) {
    let operator = other.entity.operator;
    let value = other.entity.value;
    switch (operator) { 
      case MathOperator.ADD:
        this._value += value;
        break;
      case MathOperator.SUB:
        this._value -= value;
        break;
      case MathOperator.MUL:
        this._value = Math.floor(this._value * value);
        break;
      case MathOperator.DIV:
        this._value = Math.floor(this._value / value);
        break;
      default:
        break;
    }
   },

  jump(other) {
    other.entity.onCollide();
    this.state = PlayerState.Jump;
    this.fire(PlayerEvent.Jump);
    let curve = other.entity.curve;
    let distanceJump = other.entity.distanceJump;
    let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
    let distance = targetPos.clone().sub(this.entity.getPosition()).length();
    let duration = distance / GameConstant.GAME_SPEED;
    Tween.createCountTween({
      duration,
      onUpdate: (dt) => {
        let pos = curve.value(dt.percent);
        let tmpPos = this.entity.getPosition();
        this.entity.setPosition(tmpPos.x, pos, tmpPos.z);
      },
      onComplete: () => { 
        Tween.createLocalTranslateTween(this.entity, {y: "+0.3"}, {
          duration: 0.05,
          repeat: 1,
          yoyo: true,
          onComplete: () => {
            this.state = PlayerState.Move;
          }
        }).start();
      }
    }).start();
    Tween.createRotateTween(this.entity, new Vec3(-360, 0, 0), {
      duration,
    }).start();
  },
  
  onCollideRedDamage(other) {
    this.state = PlayerState.Attack;
    let damage = other.entity.controller.damage;
    let value = other.entity.value;
    let speed = (damage / value) * other.entity.controller.size;
    speed /= 0.03;
    this.move.speed.set(0, 0, speed);
    other.entity.off(SpawningEvent.Despawn, this.onRedDamageAttacked, this);
    other.entity.once(SpawningEvent.Despawn, this.onRedDamageAttacked, this);
    this._value -= other.entity.controller.damage;
    if (this._value <= 0) {
      this.onDie();
    } else {
      this.fire(PlayerEvent.HitRedDamage, other.entity);
      this.eat(other.entity);
    }
  },

  onRedDamageAttacked(red) {
    this.move.speed.set(0, 0, GameConstant.GAME_SPEED);
    this.state = PlayerState.Move;
  },

  moveToSoliderBoss(other) {
    other.disable();
    this.state = PlayerState.Idle;
    this.move.disable();
    this.swipeMovement.disable();
    this.tweenIncreaseSpeed?.stop();

    this.fire(PlayerEvent.MoveToSoliderBoss);
    let targetPos = other.entity.parent.numberGroup.getPosition().clone().sub(new pc.Vec3(0, 0, 8));
    Tween.createLocalTranslateTween(this.entity, targetPos, {
      duration: 1,
      onComplete: () => {
        other.entity.parent.onFight();
        this.spawnFlowerMode(other.entity.parent);
        this.entity.number.enabled = false;
      }
    }).start();
  },

  spawnFlowerMode(target) {
    const numberPos = target.numberGroup.getLocalPosition().clone().sub(new Vec3(0, 0, 10));
    const angleStep = (2 * Math.PI) / this._value;
    let maxDistance = 0.2 / (2 * (Math.PI / this._value));
    maxDistance = Math.min(maxDistance, 6);
    for (let i = 0; i < this._value; i++) {
      var angle = i * angleStep;
      var distance = Util.random(0, maxDistance);
      var x = numberPos.x + distance * Math.cos(angle);
      var z = numberPos.z + distance * Math.sin(angle);
      var pos = new Vec3(x, numberPos.y, z);
      while (this.isPositionDuplicate(pos)) {
        distance = Util.random(0, maxDistance);
        x = numberPos.x + distance * Math.cos(angle);
        z = numberPos.z + distance * Math.sin(angle);
        pos = new Vec3(x, numberPos.y, z);
      }
      let solider = this.soliderSpawner.spawn();
      solider.setLocalPosition(numberPos);
      solider.setTarget(pos);
      target.addChild(solider);
      solider.scaleUp();
      SoliderManager.instance.addSoliderPlayer(solider);
      this.soliders.push(solider);
    }
  },

  isPositionDuplicate(pos) { 
    for (let i = 0; i < this.soliders.length; i++) {
      if (this.soliders[i].getPosition().equals(pos)) {
        return true;
      }
    }
    return false;
  },

  moveToBigBoss(other) {
    other.disable();
    this.state = PlayerState.Idle;
    this.move.disable();
    this.tweenIncreaseSpeed?.stop();
    this.swipeMovement.disable();
    let targetPos = other.entity.parent.numberGroup.getPosition();
    Tween.createLocalTranslateTween(this.entity, targetPos, {
      duration: 1,
    }).start();
  },

  fightBigBoss(other) { 
    let boss = other.entity.parent;
    boss.onCollide();
    if(this._value > other.entity.value) {
      this.onWinWhenFightBigBoss();
      boss.onLose();
    } else {
      boss.onWin();
      this.onLose();
    }
  },

  onWinWhenFightBigBoss() {
    this.fire(PlayerEvent.FightToBigBoss);
    Tween.createLocalTranslateTween(this.entity, {
      z: "-3", x: 0,
    }, {
      easing: Tween.Easing.Quadratic.Out,
      duration: 0.7
    }).start();
    this.tweenRotate = Tween.createRotateTween(this.entity, {
      x: 12, y: 720, z: 0,
    }, {
      duration: 1,
      onComplete: () => { 
        this.onWin();
      }
    }).start();
  },

  eat(entity) {
    entity.onCollide();
    this.updateValue(this._value);
    this.fire(PlayerEvent.Eat, this._value);
  },

  onDie() {
    this.state = PlayerState.Die;
    this.move.disable();
    this.tweenIncreaseSpeed?.stop();
    this.swipeMovement.disable();
    this.collider.disable();
    this.spawnBreakNumber();
    this.fire(PlayerEvent.Lose);
  },

  spawnBreakNumber() {
    let nums = this.entity.number.elements;
    for (let i = 0; i < nums.length; i++) {
      let number = nums[i];
      let pos = number.getLocalPosition();
      let rot = number.getLocalEulerAngles();
      let scale = number.getLocalScale();
      let value = nums[i].value;
      let numberBreak = new NumberBreak(parseInt(value));
      this.entity.number.addChild(numberBreak);
      this.breaks.push(numberBreak);
      numberBreak.setLocalPosition(pos);
      numberBreak.setLocalEulerAngles(rot);
      numberBreak.setLocalScale(scale);
      numberBreak.updateMaterial(number.model.meshInstances[0].material);
      numberBreak.objectBreak.play();
      number.fire(SpawningEvent.Despawn);
    }
  },

  onLose() {
    this.state = PlayerState.Lose;
    this.spawnBreakNumber();
    this.fire(PlayerEvent.Lose);
  },

  onWin() {
    this.state = PlayerState.Win;
    this.reduceOnWin();
    this.fire(PlayerEvent.Win);
  },

  updateValue(value) {
    this._value = value;
    this.entity.updateValue(value);
  },

  _insideRoads(pos) {
    for (var i = 0; i < this.blockAreas.length; i++) {
      if (this.blockAreas[i].orientedBox.containsPoint(pos)) {
        return true;
      }
    }
    return false;
  },

  reduceOnWin() {
    let valueStep = this._value * UserData.income / GameConstant.TOTAL_MONEY_SPAWN;
    let t = 0;
    Tween.createTween({ value: this._value }, {
      value: 0,
    },{
      duration: 2,
      onUpdate: (dt) => {
        t = this._value - dt.value;
        if (t >= valueStep) {
          t = 0;
          this.updateValue(Math.floor(dt.value));
        } else if (dt.value < valueStep) {
          this.updateValue(Math.floor(dt.value));
        }
      }
    }).start();
  },

  onStart() {
    this.state = PlayerState.Move;
    this.move.enable();
  },

  onFall() {
    this.state = PlayerState.Die;
    this.fire(PlayerEvent.Fall);
    this.tweenIncreaseSpeed?.stop();
  },

  notCollide(other) { 
    
  }
});