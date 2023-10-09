import { Vec2 } from "playcanvas";
import { SATCollisionInfo } from "./SATCollisionInfo";
import { SATCollisionTag } from "./SATCollisionTag";

export class SATCollisionManager {
  static _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new SATCollisionManager();
    }

    return this._instance;
  }

  constructor() {
    this.groups = {};
  }

  reset() {
    this.groups = {};
  }

  init(filters) {
    this.filters = filters;
    Object.keys(SATCollisionTag).forEach((key) => {
      var tag = SATCollisionTag[key];
      this.groups[tag] = [];
    });
  }

  update() {
    this.filters.forEach((filter) => this._checkFilter(filter));
  }

  _checkFilter(filter) {
    filter.collideTags.forEach((tag) => this._checkTags(filter.tag, tag));
  }

  _checkTags(tag1, tag2) {
    this.groups[tag1].forEach((collider) => {
      if (collider.enabled) {
        this._checkCollider(collider, this.groups[tag2]);
      }
    });
  }

  _checkCollider(collider, group) {
    for (var i = 0; i < group.length; i++) {
      var collider2 = group[i];
      if (collider.IgnoreColliders.includes(collider2)) {
        continue;
      }
      if (collider2.IgnoreColliders.includes(collider)) {
        continue;
      }

      if (collider2.enabled && this._iscollide(collider, collider2)) {
        // eslint-disable-next-line max-depth
        if (collider.owner === collider2.owner) {
          continue;
        }
        collider.fire(SATCollisionEvent.OnCollide, collider2);
        collider2.fire(SATCollisionEvent.OnCollide, collider);
      }
      else {
        collider.fire(SATCollisionEvent.NotCollide, collider2);
        collider2.fire(SATCollisionEvent.NotCollide, collider);
      }
      if (!collider.enabled) {
        return;
      }
    }
  }

  _iscollide(collider1, collider2) {
    let testAB = this._polygonPolygonTest(collider1, collider2);
    if (!testAB) {
      return false;
    }

    let testBA = this._polygonPolygonTest(collider2, collider1, true);
    if (!testBA) {
      return false;
    }

    return true;
  }

  add(collider) {
    let tag = collider.tag;
    this.groups[tag].push(collider);
  }

  remove(collider) {
    let tag = collider.tag;
    let group = this.groups[tag];
    let index = group.indexOf(collider);
    if (index >= 0) {
      group.splice(index, 1);
    }
  }

  _circleCircleTest(circleA, circleB) {
    let radiusTotal = circleA.getTransformedRadius() + circleB.getTransformedRadius();
    let distanceBetween = Math.sqrt((circleB.x - circleA.x) ** 2 + (circleB.y - circleA.y) ** 2);

    if (distanceBetween > radiusTotal) {
      return false;
    }

    let result = new SATCollisionInfo();
    result.shapeA = circleA;
    result.shapeB = circleB;

    result.vector = new Vec2(circleB.x - circleA.x, circleB.y - circleA.y);
    result.vector.normalize();

    result.distance = distanceBetween;

    var diff = radiusTotal - distanceBetween;
    result.separation = new Vec2(result.vector.x * diff, result.vector.y * diff);

    var radA = circleA.getTransformedRadius();
    var radB = circleB.getTransformedRadius();
    result.shapeAContained = radA <= radB && distanceBetween <= radB - radA;
    result.shapeBContained = radB <= radA && distanceBetween <= radA - radB;

    return true;
  }

  _polygonPolygonTest(polygonA, polygonB, flipResultPositions = false) {
    let shortestDist = Number.MAX_VALUE;

    let transformedPolygonA = polygonA.polygon.getTransformed();
    let transformedPolygonB = polygonB.polygon.getTransformed();
    let verts1 = transformedPolygonA.vertices;
    let verts2 = transformedPolygonB.vertices;

    let result = new SATCollisionInfo();
    result.shapeA = flipResultPositions ? polygonB : polygonA;
    result.shapeB = flipResultPositions ? polygonA : polygonB;
    result.shapeAContained = true;
    result.shapeBContained = true;

    // let vOffset = new Vec2(transformedPolygonA.pivot.x - transformedPolygonB.pivot.x, transformedPolygonA.pivot.y - transformedPolygonB.pivot.y);

    for (let i = 0; i < verts1.length; i++) {
      let axis = this._getPerpendicularAxis(verts1, i);
      let polyARange = this._projectVertsForMinMax(axis, verts1);
      let polyBRange = this._projectVertsForMinMax(axis, verts2);

      // var scalerOffset = this._vectorDotProduct(axis, vOffset);
      // polyARange.min += scalerOffset;
      // polyARange.max += scalerOffset;

      if ((polyARange.min - polyBRange.max > 0) || (polyBRange.min - polyARange.max > 0)) {
        return false;
      }

      this._checkRangesForContainment(polyARange, polyBRange, result, flipResultPositions);

      let distMin = (polyBRange.max - polyARange.min) * -1;
      if (flipResultPositions) {
        distMin *= -1;
      }

      let distMinAbs = Math.abs(distMin);
      if (distMinAbs < shortestDist) {
        shortestDist = distMinAbs;

        result.distance = distMin;
        result.vector = axis;
      }
    }

    result.separation = new Vec2(result.vector.x * result.distance, result.vector.y * result.distance);

    return true;
  }

  static _circlePolygonTest(circle, polygon, flipResultPositions) {
    let shortestDist = Number.MAX_VALUE;

    let result = new SATCollisionInfo();
    result.shapeA = flipResultPositions ? polygon : circle;
    result.shapeB = flipResultPositions ? circle : polygon;
    result.shapeAContained = true;
    result.shapeBContained = true;
    let verts = polygon.polygon.getTransformedVerts(); // .vertices.map(x => x.clone());

    let closestVertex = new Vec2();
    for (let vert of verts) {
      let dist = (circle.x - (polygon.x + vert.x)) ** 2 + (circle.y - (polygon.y + vert.y)) ** 2;
      if (dist < shortestDist) {
        shortestDist = dist;
        closestVertex.x = polygon.x + vert.x;
        closestVertex.y = polygon.y + vert.y;
      }
    }


    // calculate the axis from the circle to the point
    let axis = new SATPoint(closestVertex.x - circle.x, closestVertex.y - circle.y);
    axis.normalize();

    // project the polygon onto this axis
    let polyRange = SAT._projectVertsForMinMax(axis, verts);

    // shift the polygon along the axis
    var scalerOffset = SAT._vectorDotProduct(axis, vOffset);
    polyRange.min += scalerOffset;
    polyRange.max += scalerOffset;

    // project the circle onto this axis
    let circleRange = this._projectCircleForMinMax(axis, circle);

    // if there is a gap then bail now
    if ((polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max > 0)) {
      // there is a gap - bail
      return null;
    }


    // calc the separation and store if this is the shortest
    let distMin = (circleRange.max - polyRange.min);
    if (flipResultPositions) {
      distMin *= -1;
    }

    // store this as the shortest distances because it is the first
    shortestDist = Math.abs(distMin);

    result.distance = distMin;
    result.vector = axis;

    // check for containment
    this._checkRangesForContainment(polyRange, circleRange, result, flipResultPositions);


    // now loop over the polygon sides and do a similar thing
    for (let i = 0; i < verts.length; i++) {
      // get the perpendicular axis that we will be projecting onto
      axis = SAT._getPerpendicularAxis(verts, i);
      // project each point onto the axis and circle
      polyRange = SAT._projectVertsForMinMax(axis, verts);

      // shift the first polygons min max along the axis by the amount of offset between them
      var scalerOffset = SAT._vectorDotProduct(axis, vOffset);
      polyRange.min += scalerOffset;
      polyRange.max += scalerOffset;

      // project the circle onto this axis
      circleRange = this._projectCircleForMinMax(axis, circle);

      // now check for a gap betwen the relative min's and max's
      if ((polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max > 0)) {
        // there is a gap - bail
        return null;
      }

      // check for containment
      this._checkRangesForContainment(polyRange, circleRange, result, flipResultPositions);

      distMin = (circleRange.max - polyRange.min);// * -1;
      if (flipResultPositions) {
        distMin *= -1;
      }

      // check if this is the shortest by using the absolute val
      let distMinAbs = Math.abs(distMin);
      if (distMinAbs < shortestDist) {
        shortestDist = distMinAbs;

        result.distance = distMin;
        result.vector = axis;
      }
    }

    // calc the final separation
    result.separation = new Vec2(result.vector.x * result.distance, result.vector.y * result.distance);

    // if you make it here then no gaps were found
    return result;


  }

  _projectVertsForMinMax(axis, verts) {
    let min = this._vectorDotProduct(axis, verts[0]);
    let max = min;

    for (let j = 1; j < verts.length; j++) {
      let temp = this._vectorDotProduct(axis, verts[j]);
      if (temp < min) {
        min = temp;
      }
      if (temp > max) {
        max = temp;
      }
    }

    return { min: min, max: max };
  }

  _getPerpendicularAxis(verts, index) {
    let pt1 = verts[index];
    let pt2 = index >= verts.length - 1 ? verts[0] : verts[index + 1];

    let axis = new Vec2(-(pt2.y - pt1.y), pt2.x - pt1.x);
    axis.normalize();
    return axis;
  }

  _vectorDotProduct(pt1, pt2) {
    return (pt1.x * pt2.x) + (pt1.y * pt2.y);
  }

  _checkRangesForContainment(rangeA, rangeB, collisionInfo, flipResultPositions) {
    if (flipResultPositions) {
      if (rangeA.max < rangeB.max || rangeA.min > rangeB.min) {
        collisionInfo.shapeAContained = false;
      }
      if (rangeB.max < rangeA.max || rangeB.min > rangeA.min) {
        collisionInfo.shapeBContained = false;
      }
    }
    else {
      if (rangeA.max > rangeB.max || rangeA.min < rangeB.min) {
        collisionInfo.shapeAContained = false;
      }
      if (rangeB.max > rangeA.max || rangeB.min < rangeA.min) {
        collisionInfo.shapeBContained = false;
      }
    }
  }
}

export const SATCollisionEvent = Object.freeze({
  OnCollide  : "collide",
  NotCollide : "notCollide",
});
