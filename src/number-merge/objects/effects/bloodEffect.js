import { Curve, CurveSet, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";

export class BloodEffect extends Entity {
  constructor(color) {
    super("blood-effect");
    this.color = color || [220, 0, 0];
    this._initBloodParticle();
    this._initBloodSprite();
  }

  _initBloodParticle() { 
    this.bloodParticle = new Entity("blood_particle");
    this.bloodParticle.setLocalPosition(0, 0.3, 0);
    this.addChild(this.bloodParticle);;

    let velocityGraph = new CurveSet([
      [0, -2],
      [0, -1.5, 1, -3],
      [0, -2]
    ]);

    let velocityGraph2 = new CurveSet([
      [0, 2],
      [0, 2, 1, -3],
      [0, 2]
    ]);

    let scaleGraph = new Curve([0, 0.005, 0.35, 0.03, 0.8, 0]);
    let colorGraph = new CurveSet([
      [0, this.color[0]],
      [0, this.color[1]],
      [0, this.color[2]]
    ]);

    this.bloodParticle.addComponent("particlesystem", {
      numParticles: 10,
      lifetime: 0.4,
      rate: 0,
      autoPlay: false,
      loop: false,
      startAngle: 0,
      startAngle2: 360,
      velocityGraph,
      velocityGraph2,
      scaleGraph,
      colorGraph,
      colorMap: AssetLoader.getAssetByKey("tex_circle").resource,
    });
  }

  _initBloodSprite() { 
    let asset = AssetLoader.getAssetByKey("spr_blood");
    asset.resource.pixelsPerUnit = 100;
    this.bloodSprite = new Entity(asset.name);
    this.bloodSprite.addComponent("sprite", { spriteAsset: asset });
    this.bloodSprite.setLocalEulerAngles(-90, 0, 0);
    this.bloodSprite.setLocalPosition(0, 0.1, -0);
    this.bloodSprite.setLocalScale(0.1, 0.1, 0.1);
    this.bloodSprite.sprite.opacity = 0.7;
    this.bloodSprite.sprite.color = Util.createColor(this.color[0], this.color[1], this.color[2]);
    this.addChild(this.bloodSprite);
  }

  play() {
    this.bloodParticle.particlesystem.reset();
    this.bloodParticle.particlesystem.play();
    if (this.enabled) {
      setTimeout(() => {
        this.fire(SpawningEvent.Despawn);
      }, this.bloodParticle.particlesystem.lifetime * 1000);
    }
  }
}