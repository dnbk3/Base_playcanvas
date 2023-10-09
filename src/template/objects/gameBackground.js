import { Entity, SPRITETYPE_SIMPLE, Vec3, Texture, Sprite } from "playcanvas";
import { Game } from "../../game";
export class GameBackground extends Entity {
  constructor(texture) {
    super("background");
    // create textureatlas from texture
    let textureAtlas = new pc.TextureAtlas();
    textureAtlas.frames = {
      background: {
        rect: new pc.Vec4(0, 0, texture.width, texture.height),
        pivot: new pc.Vec2(0.5, 0.5),
      }
    };
    textureAtlas.texture = texture;

    // create sprite from textureatlas
    let sprite = new pc.Sprite(Game.app.graphicsDevice, {
      atlas: textureAtlas,
      frameKeys: ["background"],
      pixelsPerUnit: 100,
      renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
    });

    // add sprite component to entity
    this.addComponent("sprite", {
      type: SPRITETYPE_SIMPLE,
      sprite: sprite
    });
    Game.app.on("resize", this.resize, this);
    this.resize();
  }

  destroy() {
    super.destroy();
    Game.app.off("resize", this.resize, this);
  }

  resize() {
    let scaleX = 1;
    let scaleY = 1;
    let pos = new Vec3();

    if (Game.isPortrait()) {
      scaleX = 200;
      scaleY = 160;
      pos.set(0, -200, 400);
    } else {
      scaleX = 2000;
      scaleY = 160;
      pos.set(0, -200, 400);
    }
    this.setLocalScale(scaleX, scaleY, 1);
    this.setLocalPosition(pos);
  }
}
