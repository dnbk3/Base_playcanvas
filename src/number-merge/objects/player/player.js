import { Entity, StandardMaterial, Vec3 } from "playcanvas";
import { NumberGroup } from "../obstacles/number/numberGroup";
import { Move } from "../../scripts/components/move";
import { GameConstant } from "../../../gameConstant";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../physics/collisionTag";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Spawner } from "../../scripts/spawners/spawner";
import { Solider } from "../boss/solider/solider";
import { Tween } from "../../../template/systems/tween/tween";

export class Player extends Entity{
  constructor() {
    super();
    this._initRays();
    this.number = new NumberGroup();
    this.addChild(this.number);
    this.number.config({
      value: GameConstant.PLAYER_START_NUMBER,
      pos: { x: 0, y: 0, z: 0 },
      rot: { x: 12, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
    this.number.updateMaterial(AssetLoader.getAssetByKey("mat_blue_number").resource);
    this.number.collider.enabled = false;
    this.value = this.number.value;
    this.move = this.addScript(Move, {
      speed: new Vec3(0, 0, GameConstant.GAME_SPEED),
    });
    this.move.disable();
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Player,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 0, 0),
      scale: new Vec3(0.5 * this.value.toString().length, 1, 0.5),
    });
    this._initSoliderSpawner();
  }

  _initRays() {
    this.debugRayEntity = new Entity();
    this.debugRayEntity.setLocalScale(0.1, 0.1, 0.1);
    this.addChild(this.debugRayEntity);
    if (GameConstant.DEBUG_RAY) {
      let mat = new StandardMaterial();
      mat.diffuse.set(1, 0, 0);
      this.debugRayEntity.addComponent("model", {
        type: "sphere",
      });
      this.debugRayEntity.model.material = mat;
    }
  }

  setDebugRay(direction) {
    let valueString = this.value.toString();
    let scale = this.getSize(valueString);
    let x = 0.2 * valueString.length * direction * scale;
    this.debugRayEntity.setLocalPosition(x, 0.5, 0);
  }

  getSize(valueString) {
    let targetScale = this.value / 1000 + Math.pow(1.16, valueString.length - 1);
    let scale = Math.min(targetScale, 1.9);
    return scale;
  }

  _initSoliderSpawner() {
    let soliderEntity = new Entity();
    this.addChild(soliderEntity);
    this.soliderSpawner = soliderEntity.addScript(Spawner, {
      class: Solider,
      poolSize: 500,
      args: [CollisionTag.SoliderPlayer, 1],
    });
  }

  updateValue(value) { 
    this.value = value;
    this.number.updateValue(value);
    let scale = this.getSize(value.toString());
    this.collider.box.setLocalScale(0.5 * value.toString().length * scale, 1, 0.5);
  }

  onEat() {
    Tween.createScaleTween(this, new Vec3(1.3, 1.3, 1.3), {
      duration: 0.06,
      easing: Tween.Easing.Sinusoidal.Out,
      onComplete: () => {
        Tween.createScaleTween(this, new Vec3(1, 1, 1), {
          duration: 0.14,
          easing: Tween.Easing.Quadratic.Out
        }).start();
      }
    }).start();
  }

  onStart() {
    this.controller.onStart();
  }

  reset() { 
    this.controller.reset();
    this.collider.enable();
    this.number.enabled = true;
  }
}