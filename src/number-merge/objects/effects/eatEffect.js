import { Curve, CurveSet, Entity, Vec3 } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { SphereColor } from "./sphereColor";
import { Util } from "../../../helpers/util";
import { AssetLoader } from "../../../assetLoader/assetLoader";
export class EatEffect extends Entity {
  constructor() {
    super();
    let sphereSpawnEntity = new Entity();
    this.addChild(sphereSpawnEntity);
    sphereSpawnEntity.setLocalPosition(this.offset);
    let particleConfig = {
      lifeTime: [0.3, 0.5],
      alignToMotion: true,
      gravity: 0,
      startSize: [new Vec3(0.5, 1, 0.5), new Vec3(1, 2, 1)],
      velocity: [new Vec3(-3, 0, 0), new Vec3(3, 4, 0)],
      alphaGraph: new Curve([0, 0.3, 1, 0]),
      scaleGraph: new Curve([0, 0, 0.5, 1, 1, 0]),
      emitterInnerExtents: new Vec3(2, 2, 0),
    }
    this.sphereSpawner = sphereSpawnEntity.addScript(Spawner, {
      class: SphereColor,
      poolSize: 21,
      args: [Util.createColor(78, 205, 255), particleConfig]
    });

    this.auraFx = new Entity();
    this.auraFx.setLocalPosition(0, 1, 0);
    this.addChild(this.auraFx);
    let scale = 1.2;
    let scaleGraph = new Curve([0, 0.24 * scale, 1, 1 * scale]);
    let alphaGraph = new Curve([0, 1, 1, 0]);
    let rotationSpeedGraph = new Curve([0, -100, 1, 100]);
    let colorGraph = new CurveSet([
      [0, 15/255, 1, 0/255],
      [0, 0, 1, 168/255],
      [0, 255/255, 1, 255/255]
    ]);

    this.auraFx.addComponent("particlesystem", {
      numParticles: 2,
      lifetime: 0.2,
      rate: 0.01,
      autoPlay: false,
      loop: false,
      startAngle: -100,
      startAngle2: 100,
      scaleGraph,
      colorGraph,
      alphaGraph,
      rotationSpeedGraph,
      colorMap: AssetLoader.getAssetByKey("tex_aura").resource,
    });
  }

  updateSizeAura(size) {
    this.auraFx.particlesystem.scaleGraph = new Curve([0, 0.24 * size * 1.2, 1, 1 * size * 1.2]);
  }

  play(target) {
    for (let i = 0; i < 13; i++) {
      this.sphereSpawner.spawn(this);
    }
    this.setLocalPosition(target.getLocalPosition());
  }

  playAt(target) {
    let tmp = target.getPosition();
    tmp.y += 0.5;
    // for (let i = 0; i < 5; i++) {
    //   let sphere = this.sphereSpawner.spawn(this);
    //   sphere.setLocalPosition(tmp);
    // }
    this.auraFx.particlesystem.reset();
    this.auraFx.particlesystem.play();
    this.auraFx.setLocalPosition(tmp.x, tmp.y + 0.65, tmp.z);
  }
}
