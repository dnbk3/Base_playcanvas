import { Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
export class Number extends Entity{
  constructor(value) {
    super();
    this.addComponent("model", {
      asset: AssetLoader.getAssetByKey("model_" + value),
    });
    this.value = value;
  }

  updateMaterial(material) { 
    this.model.meshInstances[0].material = material;
  }
}