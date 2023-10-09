const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, "../assets/jsons/assetData.json");


// clear file output
fs.writeFileSync(OUTPUT_PATH, "");

let totalSize = 0;
let totalSpriteSize = 0;
let totalTextureSize = 0;
let totalModelSize = 0;
let totalFontSize = 0;
let totalSpineSize = 0;
let totalAudioSize = 0;
// read and write all sprites
console.log("--------------- SPRITES ---------------");
var allSprite = read("sprites");
allSprite.forEach((sprite, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(sprite) + ",\n");
  console.log("Writing sprites: " + sprite.key + " - " + sprite.size.toFixed(2) + " KB");
  if (index === allSprite.length - 1) {
    console.log("All sprites passed: " + allSprite.length);
    totalSpriteSize = allSprite.reduce((total, sprite) => total + sprite.size, 0);
    console.log("Total sprite size: " + totalSpriteSize.toFixed(2) + " KB" + "\n");
  }
});

// read and write all textures
console.log("--------------- TEXTURES ---------------");
var allTexture = read("textures");
allTexture.forEach((texture, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(texture) + ",\n");
  console.log("Writing texture: " + texture.key + " - " + texture.size.toFixed(2) + " KB");
  if (index === allTexture.length - 1) {
    console.log("All textures passed: " + allTexture.length);
    totalTextureSize = allTexture.reduce((total, texture) => total + texture.size, 0);
    console.log("Total texture size: " + totalTextureSize.toFixed(2) + " KB" + "\n");
  }
});

// read and write all models
console.log("--------------- MODELS ---------------");
var allModel = read("models");
allModel.forEach((model, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(model) + ",\n");
  console.log("Writing model: " + model.key + " - " + model.size.toFixed(2) + " KB");
  if (index === allModel.length - 1) {
    console.log("All models passed: " + allModel.length);
    totalModelSize = allModel.reduce((total, model) => total + model.size, 0);
    console.log("Total model size: " + totalModelSize.toFixed(2) + " KB" + "\n");
  }
});

// read and write all fonts
console.log("--------------- FONTS ---------------");
var allFont = readFont("fonts");
allFont.forEach((font, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(font) + ",\n");
  console.log("Writing font: " + font.key + " - " + font.size.toFixed(2) + " KB");
  if (index === allFont.length - 1) {
    console.log("All font passed: " + allFont.length);
    totalFontSize = allFont.reduce((total, model) => total + model.size, 0);
    console.log("Total font size: " + totalFontSize.toFixed(2) + " KB" + "\n");
  }
});

// read and write all spines
console.log("--------------- SPINES ---------------");
var allSpine = readSpines("spines");
if (allSpine === undefined) {
  console.log("Spine folder not found");
} else {
  allSpine.forEach((spine, index) => {
    spine.data.forEach((spineData, index) => {
      fs.appendFileSync(OUTPUT_PATH, JSON.stringify(spineData) + ",\n");
      console.log("Writing spine: " + spineData.key + " - " + spineData.size.toFixed(2) + " KB");
    });
    if (index === allSpine.length - 1) {
      console.log("All spines passed: " + allSpine.length);
      totalSpineSize = spine.data.reduce((total, spineData) => total + spineData.size, 0);
      console.log("Total spine size: " + totalSpineSize.toFixed(2) + " KB" + "\n");
    }
  });
}

// read and write all audios
console.log("--------------- AUDIOS ---------------");
var allAudio = read("audios");
allAudio.forEach((audio, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(audio) + ",\n");
  console.log("Writing audio: " + audio.key + " - " + audio.size.toFixed(2) + " KB");
  if (index === allAudio.length - 1) {
    console.log("All audios passed: " + allAudio.length);
    totalAudioSize = allAudio.reduce((total, audio) => total + audio.size, 0);
    console.log("Total audio size: " + totalAudioSize.toFixed(2) + " KB" + "\n");
  }
});

totalSize = totalSpriteSize + totalTextureSize + totalFontSize + totalModelSize + totalSpineSize + totalAudioSize;
console.log("------- TOTAL ASSET SIZE: " + totalSize.toFixed(2) + " KB -------");
//convert output file to json array
let data = fs.readFileSync(OUTPUT_PATH, "utf8");
data = data.replace(/,\n$/, "");
data = "[" + data + "]";
fs.writeFileSync(OUTPUT_PATH, data);

function read(type) {
  const files = fs.readdirSync(path.resolve(__dirname, "../assets/" + type));
  let data = [];
  files.forEach((file) => {
    let size = fs.statSync(path.resolve(__dirname, "../assets/" + type + "/" + file)).size / 1024;
    if(file === ".DS_Store") return;
    data.push({
      key: file.split(".")[0],
      url: `assets/${type}/${file}`,
      type: type.slice(0, -1), // remove 's' from type
      size: size,
    });
  });
  return data;
}

function readFont(type) {
  const files = fs.readdirSync(path.resolve(__dirname, "../assets/" + type));
  let data = [];
  files.forEach((file) => {
    let size = fs.statSync(path.resolve(__dirname, "../assets/" + type + "/" + file)).size / 1024;
    let ext = file.split(".")[1];
    if(ext !== "json") return;
    data.push({
      key: file.split(".")[0],
      url: `assets/${type}/${file}`,
      type: type.slice(0, -1), // remove 's' from type
      size: size,
    });
  });
  return data;
}

function readSpines() {
  let isSpineFolder = fs.existsSync(path.resolve(__dirname, "../assets/spines"));
  if (!isSpineFolder) return;
  const files = fs.readdirSync(path.resolve(__dirname, "../assets/spines"));
  let spineDatas = [];
  files.forEach((spineFolder) => {
    let spineData = {};
    if (spineFolder === ".DS_Store") return;
    let pathFile = path.resolve(__dirname, "../assets/spines/" + spineFolder);
    let spineFiles = fs.readdirSync(pathFile);
    spineData.key = spineFolder;
    spineData.data = [];
    spineFiles.forEach((spineFile) => {
      if (spineFile === ".DS_Store") return;
      let ext = spineFile.split(".")[1];
      let type = null;
      if (ext === "json") {
        type = "json";
      } else if (ext === "png") {
        type = "texture";
      } else if (ext === "atlas") { 
        type = "text";
      }
      let size = fs.statSync(path.resolve(__dirname, "../assets/spines/" + spineFolder + "/" + spineFile)).size / 1024;
      spineData.data.push({
        key: spineFolder + "_" + ext,
        url: `assets/spines/${spineFolder}/${spineFile}`,
        type: type,
        size: size,
      });
    });
    spineDatas.push(spineData);
  });
  return spineDatas;
}