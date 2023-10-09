import { Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectBreak } from "../../../scripts/components/objectBreak";
export class NumberBreak extends Entity {
  constructor(value) {
    super();
    this.addComponent("model", {
      asset: AssetLoader.getAssetByKey("model_break_" + value),
    });
    let pieces = this.children[0].children[0].children;
    this.objectBreak = this.addScript(ObjectBreak, {
      pieces: pieces
    });
  }

  updateMaterial(material) {
    this.model.meshInstances.forEach(mesh => {
      mesh.material = material;
    });
  }
}