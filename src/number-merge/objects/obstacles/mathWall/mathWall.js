import { Entity, Vec3, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { EndWall } from "../wall/endWall";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export const MathOperator = Object.freeze({
  ADD: "+",
  SUB: "-",
  MUL: "x",
  DIV: "÷",
});
export class MathWall extends Entity{
  constructor() {
    super();
    this.middle = new Entity("middle");
    this.addChild(this.middle);

    this.middle.addComponent("model", { asset: AssetLoader.getAssetByKey("model_middle_wall") });
    this.leftWall = new EndWall();
    this.addChild(this.leftWall);

    this.rightWall = new EndWall();
    this.addChild(this.rightWall);
    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.HeadWall,
      render: GameConstant.DEBUG_COLLIDER,
      position: new Vec3(0, 1.5, 0),
      scale: new Vec3(0.44, 3, 0.44),
    });
    this.on(SpawningEvent.Spawn, () => {
      this.collider.enable();
    })
  }

  config(data) { 
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.configLeftWall(data.leftValue);
    this.configRightWall(data.rightValue);
  }

  getOperator(value) {
    let operator = value.substring(0, 1);
    return operator;
  }

  getValue(value) {
    let val = value.substring(1, value.length);
    return parseInt(val);
  }

  configLeftWall(value) {
    let matLeft = null;
    let operator = this.getOperator(value);
    let val = this.getValue(value);
    if (operator === MathOperator.SUB || operator === MathOperator.DIV) {
      matLeft = AssetLoader.getAssetByKey("mat_red_wall").resource;
    } else {
      matLeft = AssetLoader.getAssetByKey("mat_green_wall").resource;
    }
    let leftWallConfig = {
      position: new Vec3(1.9, 1.5, 0),
      rot: new Vec3(0, 0, 0),
      size: new Vec3(3.6, 3, 0.08),
      material: matLeft,
      value: val,
      rot: new Vec3(0, 0, 0),
    }
    this.leftWall.config(leftWallConfig, operator);
  }

  configRightWall(value) {
    let matRight = null;
    let operator = this.getOperator(value);
    let val = this.getValue(value);
    if (operator === MathOperator.SUB || operator === MathOperator.DIV) {
      matRight = AssetLoader.getAssetByKey("mat_red_wall").resource;
    } else {
      matRight = AssetLoader.getAssetByKey("mat_green_wall").resource;
    }
    let rightWallConfig = {
      position: new Vec3(-1.9, 1.5, 0),
      rot: new Vec3(0, 0, 0),
      size: new Vec3(3.6, 3, 0.08),
      material: matRight,
      value: val,
      rot: new Vec3(0, 0, 0),
    }
    this.rightWall.config(rightWallConfig, operator);
  }
}