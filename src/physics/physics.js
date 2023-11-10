import { CollisionDetector } from "./collisionDetector";
import { CollisionTag } from "./collisionTag";

export class Physics {
  /**
   * @param {pc.Application} app
   */

  static init(app) {
    CollisionDetector.instance.init([
      {
        tag: CollisionTag.Player,
        collideTags: [],
      }
    ]);

    app.on("update", this.update, this);
  }

  static update() {
    CollisionDetector.instance.update();
  }

  static reset() {
    CollisionDetector.instance.reset();
  }
}
