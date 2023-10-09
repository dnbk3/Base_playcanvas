import { Entity } from "playcanvas";
import { NumberGroup } from "../obstacles/number/numberGroup";
import { CollisionTag } from "../../../physics/collisionTag";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";

export class EndCardBoss extends Entity {
  constructor() {
    super("end-card-boss");
    this.value = 0;

    this.numberGroup = new NumberGroup();
    this.addChild(this.numberGroup);
  }

  config(data) {
    this.value = data.value;
    this.numberGroup.elements.forEach(element => { 
      element.fire(SpawningEvent.Despawn);
    });
    this.numberGroup.elements = [];
    this.numberGroup.config({
      value: this.value,
      pos: { x: 0, y: 0.63, z: 40 },
      rot: { x: 12, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setLocalPosition(pos.x, pos.y, pos.z);
    this.setLocalEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.numberGroup.collider.tag = CollisionTag.Boss;
    this.numberGroup.updateMaterial(AssetLoader.getAssetByKey("mat_red_number").resource);
  }
}