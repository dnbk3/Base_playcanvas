import { Curve, Entity, Vec3 } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { SphereColor } from "./sphereColor";
import { Util } from "../../../helpers/util";

export class BlueSphereEffect extends Entity {
  constructor() {
    super();
    let sphereSpawnEntity = new Entity();
    this.addChild(sphereSpawnEntity);
    sphereSpawnEntity.setLocalPosition(this.offset);
    let particleConfig = {
      lifeTime: [0.3, 0.5],
      alignToMotion: true,
      gravity: 2,
      startSize: [new Vec3(1, 1, 1), new Vec3(2, 2, 2)],
      velocity: [new Vec3(-3, 0.5, 0), new Vec3(3, 2, -0.5)],
      alphaGraph: new Curve([0, 1, 1, 1]),
      scaleGraph: new Curve([0, 0, 0.5, 1, 1, 0]),
      emitterInnerExtents: new Vec3(0, 0, 0),
    }
    this.sphereSpawner = sphereSpawnEntity.addScript(Spawner, {
      class: SphereColor,
      poolSize: 10,
      args: [Util.createColor(62, 26, 255), particleConfig]
    });
  }

  play(target) {
    for (let i = 0; i < 1; i++) {
      this.sphereSpawner.spawn(this);
    }
    this.setLocalPosition(target.getLocalPosition());
  }

  playAt(target) {
    for (let i = 0; i < 1; i++) {
      let cash = this.sphereSpawner.spawn(this);
      let tmp = target.getPosition();
      cash.setLocalPosition(tmp);
    }
  }
}
