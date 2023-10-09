import { Entity, Vec3 } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { SphereColor } from "./sphereColor";
import { Util } from "../../../helpers/util";

export class RedDamageEffect extends Entity {
  constructor() {
    super();
    let redCubeSpawnEntity = new Entity();
    this.addChild(redCubeSpawnEntity);
    redCubeSpawnEntity.setLocalPosition(this.offset);
    this.redCubeSpawner = redCubeSpawnEntity.addScript(Spawner, {
      class: SphereColor,
      poolSize: 52,
      args: [Util.createColor(255, 20, 0)]
    });
  }

  play(target) {
    for (let i = 0; i < 14; i++) {
      this.redCubeSpawner.spawn(this);
    }
    this.setLocalPosition(target.getLocalPosition());
  }

  playAt(target) {
    for (let i = 0; i < 14; i++) {
      let cash = this.redCubeSpawner.spawn(this);
      let tmp = target.getPosition();
      tmp.y += 0.6;
      cash.setLocalPosition(tmp);
    }
  }
}
