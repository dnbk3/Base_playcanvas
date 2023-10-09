import { BLEND_NORMAL, StandardMaterial, Texture } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";

export class AssetConfigurator {
  static config() {
    this._createCanvasFont();
    this._configRoad();
    this._configNumberMaterials();
    this._configWallEndGameMaterial();
    this._configFinishLine();
    this._configBoss();
    this._configMapObjects();
  }

  static _createCanvasFont() { 
     AssetLoader.createCanvasFont("Arial", 106, "bold");
  }

  static _configMapObjects() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterial("model_wall", mat, 0);
    this.setModelMaterial("model_red_damage", mat, 0);
    this.setModelMaterial("model_middle_wall", mat, 0);
    this.setModelMaterial("model_jump", mat, 0);
    this.setModelMaterial("model_sawBlade", mat, 0);
  }

  static _configNumberMaterials() { 
    let texRed = AssetLoader.getAssetByKey("tex_red_number").resource;
    let matRed = new StandardMaterial();
    matRed.diffuseMap = texRed;
    AssetLoader.registerAsset(matRed, "mat_red_number", "material");

    let texBlue = AssetLoader.getAssetByKey("tex_blue_number").resource;
    let matBlue = new StandardMaterial();
    matBlue.diffuseMap = texBlue;
    AssetLoader.registerAsset(matBlue, "mat_blue_number", "material");
    this.setModelMaterial("model_0", matBlue, 0);
    this.setModelMaterial("model_1", matBlue, 0);
    this.setModelMaterial("model_2", matBlue, 0);
    this.setModelMaterial("model_3", matBlue, 0);
    this.setModelMaterial("model_4", matBlue, 0);
    this.setModelMaterial("model_5", matBlue, 0);
    this.setModelMaterial("model_6", matBlue, 0);
    this.setModelMaterial("model_7", matBlue, 0);
    this.setModelMaterial("model_8", matBlue, 0);
    this.setModelMaterial("model_9", matBlue, 0);
  }

  static _configWallEndGameMaterial() {
    let texGradient = AssetLoader.getAssetByKey("tex_gradient").resource;
    let matRed = new StandardMaterial();
    matRed.diffuseTint = true;
    matRed.diffuse = Util.createColor(255, 2, 0);
    matRed.opacityMap = texGradient;
    matRed.blendType = BLEND_NORMAL;
    matRed.opacityMapChannel = "r";
    matRed.depthWrite = false;
    AssetLoader.registerAsset(matRed, "mat_red_wall", "material");

    let matGreen = new StandardMaterial();
    matGreen.diffuseTint = true;
    matGreen.diffuse = Util.createColor(83, 255, 0);
    matGreen.opacityMap = texGradient;
    matGreen.blendType = BLEND_NORMAL;
    matGreen.opacityMapChannel = "g";
    matGreen.depthWrite = false;
    AssetLoader.registerAsset(matGreen, "mat_green_wall", "material");

    let mat1 = new StandardMaterial();
    mat1.diffuseTint = true;
    mat1.diffuse = Util.createColor(255, 255, 13);
    mat1.opacityMap = texGradient;
    mat1.blendType = BLEND_NORMAL;
    mat1.opacityMapChannel = "r";
    mat1.depthWrite = false;
    AssetLoader.registerAsset(mat1, "mat_1_wall", "material");

    let mat2 = new StandardMaterial();
    mat2.diffuseTint = true;
    mat2.diffuse = Util.createColor(215, 255, 20);
    mat2.opacityMap = texGradient;
    mat2.blendType = BLEND_NORMAL;
    mat2.opacityMapChannel = "r";
    mat2.depthWrite = false;
    AssetLoader.registerAsset(mat2, "mat_2_wall", "material");

    let mat3 = new StandardMaterial();
    mat3.diffuseTint = true;
    mat3.diffuse = Util.createColor(174, 255, 26);
    mat3.opacityMap = texGradient;
    mat3.blendType = BLEND_NORMAL;
    mat3.opacityMapChannel = "r";
    mat3.depthWrite = false;
    AssetLoader.registerAsset(mat3, "mat_3_wall", "material");

    let mat4 = new StandardMaterial();
    mat4.diffuseTint = true;
    mat4.diffuse = Util.createColor(134, 255, 33);
    mat4.opacityMap = texGradient;
    mat4.blendType = BLEND_NORMAL;
    mat4.opacityMapChannel = "r";
    mat4.depthWrite = false;
    AssetLoader.registerAsset(mat4, "mat_4_wall", "material");

    let mat5 = new StandardMaterial();
    mat5.diffuseTint = true;
    mat5.diffuse = Util.createColor(94, 255, 39);
    mat5.opacityMap = texGradient;
    mat5.blendType = BLEND_NORMAL;
    mat5.opacityMapChannel = "r";
    mat5.depthWrite = false;
    AssetLoader.registerAsset(mat5, "mat_5_wall", "material");

    let mat6 = new StandardMaterial();
    mat6.diffuseTint = true;
    mat6.diffuse = Util.createColor(63, 255, 44);
    mat6.opacityMap = texGradient;
    mat6.blendType = BLEND_NORMAL;
    mat6.opacityMapChannel = "r";
    mat6.depthWrite = false;
    AssetLoader.registerAsset(mat6, "mat_6_wall", "material");

    let mat7 = new StandardMaterial();
    mat7.diffuseTint = true;
    mat7.diffuse = Util.createColor(101, 255, 38);
    mat7.opacityMap = texGradient;
    mat7.blendType = BLEND_NORMAL;
    mat7.opacityMapChannel = "r";
    mat7.depthWrite = false;
    AssetLoader.registerAsset(mat7, "mat_7_wall", "material");

    let mat8 = new StandardMaterial();
    mat8.diffuseTint = true;
    mat8.diffuse = Util.createColor(140, 255, 32);
    mat8.opacityMap = texGradient;
    mat8.blendType = BLEND_NORMAL;
    mat8.opacityMapChannel = "r";
    mat8.depthWrite = false;
    AssetLoader.registerAsset(mat8, "mat_8_wall", "material");

    let mat9 = new StandardMaterial();
    mat9.diffuseTint = true;
    mat9.diffuse = Util.createColor(178, 255, 25);
    mat9.opacityMap = texGradient;
    mat9.blendType = BLEND_NORMAL;
    mat9.opacityMapChannel = "r";
    mat9.depthWrite = false;
    AssetLoader.registerAsset(mat9, "mat_9_wall", "material");

    let mat10 = new StandardMaterial();
    mat10.diffuseTint = true;
    mat10.diffuse = Util.createColor(217, 255, 19);
    mat10.opacityMap = texGradient;
    mat10.blendType = BLEND_NORMAL;
    mat10.opacityMapChannel = "r";
    mat10.depthWrite = false;
    AssetLoader.registerAsset(mat10, "mat_10_wall", "material");
  }
  
  static _configRoad() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterial("model_road", mat, 0);
  }

  static _configBoss() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterialInRange("model_bigBoss", mat, 0, 2);
    this.setModelMaterial("model_solider_boss", mat, 0);
  }

  static _configFinishLine() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_finish_line").resource;
    mat.diffuseMap = tex;
    mat.diffuseMapTiling.set(3, 0.37);
    this.setModelMaterial("model_finish_line", mat, 0);
  }

  static _configSkyboxCubemap() {
    let textures = [
      AssetLoader.getAssetByKey("tex_skybox_right"),
      AssetLoader.getAssetByKey("tex_skybox_left"),
      AssetLoader.getAssetByKey("tex_skybox_up"),
      AssetLoader.getAssetByKey("tex_skybox_down"),
      AssetLoader.getAssetByKey("tex_skybox_front"),
      AssetLoader.getAssetByKey("tex_skybox_back"),
    ];
    let cmSkybox = new Texture(Game.app.graphicsDevice, {
      cubemap: true,
    });
    cmSkybox.setSource(textures.map((texture) => texture.resource.getSource()));
    AssetLoader.registerAsset(cmSkybox, "cm_skybox", "cubemap");
  }

  /**
   * @param {pc.Texture} texture
   */
  static setTextureFiltering(texture, filter = FILTER_NEAREST, address = ADDRESS_REPEAT) {
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.addressU = address;
    texture.addressV = address;
  }

  static setSpriteSlice(spriteAsset, border = new Vec4(), pixelsPerUnit = 1) {
    let asset = AssetLoader.getAssetByKey(spriteAsset);
    asset.resource.renderMode = SPRITE_RENDERMODE_SLICED;
    this.setSpriteBorder(asset, border.x, border.y, border.z, border.w);
    this.setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit);
  }

  static setSpriteBorder(spriteAsset, left = 0, bottom = 0, right = 0, top = 0) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.atlas.frames[sprite.frameKeys[0]].border.set(left, bottom, right, top);
  }

  static setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit = 100) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.pixelsPerUnit = pixelsPerUnit;
  }

  static setModelTexture(modelAsset, textureAsset, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    let texture = AssetLoader.getAssetByKey(textureAsset);
    material.diffuseMap = texture.resource;
  }

  static setModelDiffuse(modelAsset, color, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    material.diffuse.copy(color);
    material.diffuseTint = true;
  }

  static setModelMaterial(modelAsset, material, index = 0) {
    let model = AssetLoader.getAssetByKey(modelAsset).resource;
    model.meshInstances[index].material = material;
  }

  static setModelMaterialInRange(modelAsset, material, startIndex, endIndex) {
    for (var i = startIndex; i <= endIndex; i++) {
      this.setModelMaterial(modelAsset, material, i);
    }
  }

  static setModelMaterialWithIndexes(modelAsset, material, indexes = []) {
    indexes.forEach((index) => {
      this.setModelMaterial(modelAsset, material, index);
    });
  }

  static createColorMaterial(r = 255, g = 255, b = 255, a = 1) {
    let material = new StandardMaterial();
    if (typeof r === "object") {
      material.diffuse = r;
    }
    else {
      material.diffuse = Util.createColor(r, g, b, a);
    }
    return material;
  }

  /**
   * @param {string} modelName
   * @returns {pc.StandardMaterial}
   */
  static getMaterial(modelName, index = 0) {
    let model = AssetLoader.getAssetByKey(modelName);
    let material = model.resource.meshInstances[index].material;

    if (material.id === 1) { // default material
      material = new StandardMaterial();
      model.resource.meshInstances[index].material = material;
    }

    return material;
  }
}