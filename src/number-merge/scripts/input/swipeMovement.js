import { math, Ray, Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { CastBoxEvent } from "../raycast/castBox";

export const SwipeMovement = Script.createScript({
  name       : "swipeMovement",
  attributes : {
    screenEntity : {},
    multiplier   : { default: 0 },
    speed        : { default: 1 },
    range: { default: 1 },
    blockAreas: { default: [] },
    collider: { default: null },
  },

  touchedDown       : false,
  startPos          : 0,
  currPos           : 0,
  _tmpPos           : new Vec3(),
  _tmpTouchPosition : new Vec3(),

  onEnable() {
    // Avoid big move distance when swipe on disabled
  },

  getBouding(box) {
    return box.model.meshInstances[0].aabb;
  },

  checkIntersects(ray) {
    let rayEntity = this.entity.debugRayEntity;
    let offsetX = 0.35;
    let rayPos = rayEntity.getPosition().clone();
    for (let i = 0; i < this.blockAreas.length; i++) {
      let intersected = this.blockAreas[i].orientedBox.intersectsRay(ray);
      let pos = this.blockAreas[i].getPosition().clone();
      if (intersected) {
        if (ray.direction.x > 0) { 
          if (rayPos.x + offsetX > pos.x) {
            intersected = true;
          } else {
            intersected = false;
          }
        } else {
          if (rayPos.x - offsetX < pos.x) {
            intersected = true;
          } else {
            intersected = false;
          }
        }
      }
      if (intersected) {
        return true;
      }
    }
    return false;
  },

  initialize() {
    this.reset();
  },

  reset() {
    this.posCheck = new Vec3();
    this.startPos = this.currPos;
    this.ray = new Ray();
  },

  _insideWall(pos) {
    for (var i = 0; i < this.blockAreas.length; i++) {
      if (this.blockAreas[i].orientedBox.containsPoint(pos)) {
        return true;
      }
    }
    return false;
  },

  checkRay(direc) {
    let centerPoint = this.entity.getPosition().clone();
    let direction;
    this.entity.setDebugRay(direc);
    if (direc < 0){
      direction = new Vec3(-0.1, 0, 0);
    } else {
      direction = new Vec3(0.1, 0, 0);
    }
    this.ray.set(centerPoint, direction);
    let intersected = this.checkIntersects(this.ray);
    return intersected;
  },

  update() {
    if (!this.touchedDown) {
      return;
    }
    let distance = this.startPos - this.currPos;
    let moveAmount = distance * this.multiplier;
    let velocity = Math.min(1, this.speed * Time.dt);
    this.startPos = math.lerp(this.startPos, this.currPos, velocity);
    let direction = Math.sign(moveAmount);
    this._tmpPos.copy(this.entity.getLocalPosition());
    let x = math.lerp(this._tmpPos.x, this._tmpPos.x + moveAmount, velocity);
    if (Math.abs(x) > this.range) {
      x = this.range * Math.sign(x);
    }
    this._tmpPos.x = x;
    let intersected = this.checkRay(direction);
    if (!intersected) {
      this.entity.setLocalPosition(this._tmpPos);
    }
  },

  onPointerDown(event) {
    this.touchedDown = true;

    if (event.touches && event.touches[0]) {
      this.setStart(event.touches[0]);
    }
    else {
      this.setStart(event);
    }
  },

  onPointerMove(event) {
    if (!this.touchedDown) {
      return;
    }

    if (event.touches && event.touches[0]) {
      this.setMove(event.touches[0]);
    }
    else {
      this.setMove(event);
    }
  },

  onPointerUp() {
    this.touchedDown = false;
    this.startPos = 0;
    this.currPos = 0;
  },

  setStart(position) {
    this.getScreenSpacePosition(position, this._tmpTouchPosition);
    this.startPos = this._tmpTouchPosition.x;
    this.currPos = this.startPos;
  },

  setMove(position) {
    this.getScreenSpacePosition(position, this._tmpTouchPosition);
    this.currPos = this._tmpTouchPosition.x;
  },

  getScreenSpacePosition(deviceScreenPos, dst = new Vec3()) {
    dst.x = deviceScreenPos.x * this.app.graphicsDevice.maxPixelRatio;
    dst.y = this.app.graphicsDevice.height - deviceScreenPos.y * this.app.graphicsDevice.maxPixelRatio;
    dst.z = 0;
    dst.scale(1 / this.screenEntity.screen.scale);
  },
});
