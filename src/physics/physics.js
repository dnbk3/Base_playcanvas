import { CollisionDetector } from "./collisionDetector";
import { CollisionTag } from "./collisionTag";

export class Physics {
  /**
   * @param {pc.Application} app
   */

  static init(app) {
    CollisionDetector.instance.init([
      {
        tag         : CollisionTag.Player,
        collideTags: [CollisionTag.MapObject, CollisionTag.Road, CollisionTag.EndWall, CollisionTag.Boss, CollisionTag.BigBossStart, CollisionTag.SoliderBossStart, CollisionTag.FinishLine, CollisionTag.HeadWall, CollisionTag.RedDamage, CollisionTag.Jump, CollisionTag.SawBlade],
      },
      {
        tag: CollisionTag.SoliderPlayer,
        collideTags: [CollisionTag.SoliderEnemy],
      },
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
