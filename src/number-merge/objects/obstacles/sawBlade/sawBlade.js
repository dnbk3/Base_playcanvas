import { Entity, StandardMaterial, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { Rotate } from "../../../scripts/components/rotate";
import { SawBladeController } from "../../../scripts/controllers/sawBladeController";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class SawBlade extends Entity{
  constructor() {
    super("saw-blade");
    this.base = new Entity("base");
    this.base.addComponent("model", { type: "box" });
    this.addChild(this.base);
    this.base.setLocalScale(1.5, 0.2, 0.2);
    let mat = new StandardMaterial();
    mat.diffuseTint = true;
    mat.diffuse = Util.createColor(0, 0, 0);
    this.base.model.meshInstances[0].material = mat;

    this.modelSawBlade = new Entity("model-saw-blade");
    this.modelSawBlade.addComponent("model", { asset: AssetLoader.getAssetByKey("model_sawBlade") });
    this.addChild(this.modelSawBlade);
    this.rot = this.modelSawBlade.addScript(Rotate, {
      speed: new Vec3(0, 0, -200),
    });

    this.collider = this.modelSawBlade.addScript(BoxCollider, {
      tag: CollisionTag.SawBlade,
      render: GameConstant.DEBUG_COLLIDER,
      scale: new Vec3(1.25, 1.25, 0.2),
    });
    this.controller = this.addScript(SawBladeController, {
      collider: this.collider
    });
    this.on(SpawningEvent.Spawn, this.onSpawn, this);
  }

  onSpawn() {
    this.collider.enable();
    this.controller.reset();
  }

  onCollide(){
    
  }

  config(data) { 
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
    this.controller.attackRate = data.attackRate;
    this.controller.damage = data.damage;
  }
}