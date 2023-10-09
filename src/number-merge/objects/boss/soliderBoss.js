import { Entity, Quat, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { EndCardBoss } from "./endCardBoss";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { Spawner } from "../../scripts/spawners/spawner";
import { Util } from "../../../helpers/util";
import { SoliderManager } from "../../manager/soliderManager";
import { Solider } from "./solider/solider";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";

export class SoliderBoss extends EndCardBoss {
  constructor() {
    super("solider-boss");

    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_solider_boss") });
    let colliderStartEntity = new Entity();
    this.addChild(colliderStartEntity);
    this.colliderStart = colliderStartEntity.addScript(BoxCollider, {
      tag: CollisionTag.SoliderBossStart,
      scale: new Vec3(7.47, 1, 1),
      position: new Vec3(0, 0.5, -3.844),
      render: GameConstant.DEBUG3_COLLIDER
    });

    this.soliderSpawner = this.addScript(Spawner, {
      class: Solider,
      poolSize: 200,
      args: [CollisionTag.SoliderEnemy, -1],
    });

    this.on(SpawningEvent.Spawn, () => {
      this.soliders?.forEach(solider => { 
        solider.fire(SpawningEvent.Despawn);
      });
      this.soliders = [];
      this.numberGroup.enabled = true;
      this.colliderStart.enable();
    });
  }

  onFight() {
    this.numberGroup.enabled = false;
    this.soliders = [];
    this.spawnFlowerMode();
  }

  spawnFlowerMode() {
    const numberPos = this.numberGroup.getLocalPosition();
    const angleStep = (2 * Math.PI) / this.value;
    let maxDistance = 0.2 / (2 * (Math.PI / this.value));
    maxDistance = Math.min(maxDistance, 6);
    for (let i = 0; i < this.value; i++) {
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
      solider.scaleUp();
      this.addChild(solider);
      this.soliders.push(solider);
      SoliderManager.instance.addSoliderEnemy(solider);
    }
  }

  isPositionDuplicate(pos) {
    for (let i = 0; i < this.soliders.length; i++) {
      if (this.soliders[i].getPosition().equals(pos)) {
        return true;
      }
    }
    return false;
  }
}