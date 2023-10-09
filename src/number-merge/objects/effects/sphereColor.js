import { BLEND_NORMAL, CULLFACE_NONE, CURVE_SPLINE, Curve, Entity, StandardMaterial, Vec3 } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { ParticleController } from "../../scripts/controllers/partileController";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { ParticleConfig } from "./particleConfig";

export class SphereColor extends Entity {
  constructor(color, ctrlConfig = ParticleConfig) {
    super();
    this.modelEntity = ObjectFactory.createSphere();
    this.modelEntity.setLocalScale(0.1, 0.1, 0.1);
    this.material = new StandardMaterial();
    this.material.diffuseTint = true;
    this.material.cull = CULLFACE_NONE;
    this.material.diffuse = color;
    this.material.blendType = BLEND_NORMAL;
    this.modelEntity.model.meshInstances[0].material = this.material;
    this.addChild(this.modelEntity);
    
    this.controller = this.addScript(ParticleController, {
      material: this.material,
      lifeTime: ctrlConfig.lifeTime,
      alignToMotion: ctrlConfig.alignToMotion,
      gravity: ctrlConfig.gravity,
      startSize: ctrlConfig.startSize,
      velocity: ctrlConfig.velocity,
      alphaGraph: ctrlConfig.alphaGraph,
      scaleGraph: ctrlConfig.scaleGraph,
      emitterInnerExtents: ctrlConfig.emitterInnerExtents,
    });

    this.on(SpawningEvent.Spawn, this.onSpawn, this);
  }

  onSpawn() {
    this.controller.onSpawn();
  }

  setLocalPosition(x, y, z) {
    super.setLocalPosition(x, y, z);
    this.controller.setLocalPosition(x, y, z);
  }
}
