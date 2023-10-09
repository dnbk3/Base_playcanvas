import { Entity } from "playcanvas";
import { Script } from "../../template/systems/script/script";
import { Polygon } from "../object/Polygon";
import { SATCollisionManager } from "../SATCollisionManager";
import { SATCollisionTag } from "../SATCollisionTag";

export const PolygonCollider = Script.createScript({
  name: "polygonCollider",

  attributes: {
    tag             : { default: SATCollisionTag.Default },
    vertices        : { default: [] },
    render          : { default: false },
    IgnoreColliders : { default: [] },
    owner           : { default: null },
  },

  initialize() {
    this.owner = this.owner ? this.owner : this.entity;
    var vertices = new Entity();
    this.entity.addChild(vertices);
    this.vertices.forEach((vertex) => {
      var point = new Entity();
      vertices.addChild(point);
      point.setLocalPosition(vertex[0], 0, vertex[1]);
      if (this.render) {
        point.setLocalScale(0.1, 0.1, 0.1);
        point.addComponent("model", {
          type: "sphere",
        });
      }
    });
    this.polygon = Polygon.CreatePolygon(this.entity, vertices);
    SATCollisionManager.instance.add(this);
  },

  onDestroy() {
    SATCollisionManager.instance.remove(this);
  },
});
