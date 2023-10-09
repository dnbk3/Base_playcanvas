import { Curve, Vec3 } from "playcanvas";
import { Time } from "../../../template/systems/time/time";
import { SpawningEvent } from "../spawners/spawningEvent";
import { Script } from "../../../template/systems/script/script";
import { Util } from "../../../helpers/util";

export const ParticleController = Script.createScript({
  name: "particleController",
  attributes: {
    material: { default: null },
    alignToMotion: { default: false },
    lifeTime: { default: [0.5, 0.7] },
    startAngle: { default: new Vec3(0, 0, 0) },
    startSize: { default: 1 },
    angularVelocity: { default: new Vec3(0, 0, 0) },
    linearDampen: { default: 0 },
    gravity: { default: 0 },
    velocity: { default: new Vec3(0, 0, 0) },
    alphaGraph: { default: new Curve([0, 1]) },
    scaleGraph: { default: new Curve([0, 1]) },
    emitterInnerExtents: { default: new Vec3(0, 0, 0) },
  },

  initialize() {
    this._tmpPosition = new Vec3();
    this._tmpEuler = new Vec3();
    this._tmpSize = new Vec3();
    this._angularVelocity = new Vec3();
    this._velocity = new Vec3();
    this._startSize = new Vec3();
    this.isPlay = false;
  },

  update() {
    if (this.isPlay) {
      this._curTime += Time.dt;
      if (this._curTime > this._lifeTime) {
        this.isPlay = false;
        this.entity.fire(SpawningEvent.Despawn);
        return;
      }

      this._tmpPosition.x += this._velocity.x * Time.dt;
      this._tmpPosition.y += this._velocity.y * Time.dt;
      this._tmpPosition.z += this._velocity.z * Time.dt;
      this.entity.setLocalPosition(this._tmpPosition);
      this._velocity.mulScalar(Math.max(1 - this.linearDampen * Time.dt, 0));
      this._velocity.y -= this.gravity * Time.dt;

      this._tmpEuler.x += this._angularVelocity.x * Time.dt;
      this._tmpEuler.y += this._angularVelocity.y * Time.dt;
      this._tmpEuler.z += this._angularVelocity.z * Time.dt;
      this.entity.setLocalEulerAngles(this._tmpEuler);

      this._rotateWithVelocity();

      if (this.material) {
        var alpha = this.alphaGraph.value(this._curTime / this._lifeTime);
        this.material.opacity = alpha;
        this.material.update();
      }

      var scale = this.scaleGraph.value(this._curTime / this._lifeTime);
      this._tmpSize.copy(this._startSize);
      this._tmpSize.mulScalar(scale);
      this.entity.setLocalScale(this._tmpSize);
    }
  },

  _setEmitterInnerExtend() {
    if (this._velocity.x < 0 && this._velocity.z < 0) {
      this.entity.setLocalPosition(-this.emitterInnerExtents.x / 2, this.emitterInnerExtents.y / 2, -this.emitterInnerExtents.z / 2);
    }
    else if (this._velocity.x < 0 && this._velocity.z > 0) {
      this.entity.setLocalPosition(-this.emitterInnerExtents.x / 2, this.emitterInnerExtents.y, this.emitterInnerExtents.z / 2);

    }
    else if (this._velocity.x > 0 && this._velocity.z > 0) {
      this.entity.setLocalPosition(this.emitterInnerExtents.x / 2, this.emitterInnerExtents.y, this.emitterInnerExtents.z / 2);
    }
    else if (this._velocity.x > 0 && this._velocity.z < 0) {
      this.entity.setLocalPosition(this.emitterInnerExtents.x / 2, this.emitterInnerExtents.y, -this.emitterInnerExtents.z / 2);
    }
  },

  reset() {
    if (this.startAngle[0]) {
      this._tmpEuler.x = Util.random(this.startAngle[0].x, this.startAngle[1].x);
      this._tmpEuler.y = Util.random(this.startAngle[0].y, this.startAngle[1].y);
      this._tmpEuler.z = Util.random(this.startAngle[0].z, this.startAngle[1].z);
    }
    else {
      this._tmpEuler.copy(this.startAngle);
    }

    this._velocity = new Vec3();
    if (this.velocity[0]) {
      this._velocity.x = Util.random(this.velocity[0].x, this.velocity[1].x);
      this._velocity.y = Util.random(this.velocity[0].y, this.velocity[1].y);
      this._velocity.z = Util.random(this.velocity[0].z, this.velocity[1].z);
    }
    else {
      this._velocity.copy(this.velocity);
    }

    this._setEmitterInnerExtend();
    this._tmpPosition.copy(this.entity.getLocalPosition());

    this._rotateWithVelocity();
    this.entity.setLocalEulerAngles(this._tmpEuler);

    if (this.angularVelocity[0]) {
      if (this.angularVelocity[0].x) {
        this._angularVelocity.x = Util.random(this.angularVelocity[0].x, this.angularVelocity[1].x);
        this._angularVelocity.y = Util.random(this.angularVelocity[0].y, this.angularVelocity[1].y);
        this._angularVelocity.z = Util.random(this.angularVelocity[0].z, this.angularVelocity[1].z);
      }
      else {
        this._angularVelocity.x = this._angularVelocity.y = this._angularVelocity.z = Util.random(this.angularVelocity[0], this.angularVelocity[1]);
      }
    }
    else {
      this._angularVelocity.copy(this.angularVelocity);
    }

    if (this.lifeTime[0]) {
      this._lifeTime = Util.random(this.lifeTime[0], this.lifeTime[1]);
    }
    else {
      this._lifeTime = this.lifeTime;
    }

    let startSize;
    if (this.startSize[0]) {
      if (this.startSize[0].x) {
        this._startSize.x = Util.random(this.startSize[0].x, this.startSize[1].x);
        this._startSize.y = Util.random(this.startSize[0].y, this.startSize[1].y);
        this._startSize.z = Util.random(this.startSize[0].z, this.startSize[1].z);
        this.entity.setLocalScale(this._startSize);
      }
      else {
        startSize = Util.random(this.startSize[0], this.startSize[1]);
        this.entity.setLocalScale(startSize, startSize, startSize);
      }
    }
    else {
      startSize = this.startSize;
      this.entity.setLocalScale(startSize, startSize, startSize);
    }

    this._startSize.copy(this.entity.getLocalScale());

    this._curTime = 0;
  },

  _rotateWithVelocity() {
    if (this.alignToMotion) {
      var direction = Math.atan(this._velocity.z / this._velocity.x);
      var direction2 = Math.atan(this._velocity.y / this._velocity.x);
      if (this._velocity.x > 0) {
        direction += Math.PI;
      }
      this._tmpEuler.x = 0;
      this._tmpEuler.y = direction * -180 / Math.PI;
      this._tmpEuler.z = direction2 * 180 / Math.PI;
    }
  },

  onSpawn() {
    this.reset();
    this.isPlay = true;
  },

  setLocalPosition() {
    this._tmpPosition.copy(this.entity.getLocalPosition());
  },
});
