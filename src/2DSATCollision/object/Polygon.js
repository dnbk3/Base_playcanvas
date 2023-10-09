import { Vec2 } from "playcanvas";

export class Polygon {

  vertices = [];

  static CreatePolygon(pivot, vertices) {
    var poly = new Polygon();
    poly.pivot = pivot;
    poly.vertices = vertices;
    return poly;
  }

  getTransformed() {
    let res = new Polygon();
    for (var i = 0; i < this.vertices.children.length; i++) {
      let vert = this.vertices.children[i];
      let tempVert = new Vec2();
      let vertGlobalPos = vert.getPosition();
      tempVert.x = vertGlobalPos.x;
      tempVert.y = vertGlobalPos.z;
      res.vertices.push(tempVert);
    }
    let pivotGlobalPos = this.pivot.getPosition();
    res.pivot = new Vec2();
    res.pivot.x = pivotGlobalPos.x;
    res.pivot.y = pivotGlobalPos.z;
    return res;
  }
}
