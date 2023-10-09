import { CollisionTag } from "./collisionTag";
import { CollisionEvent } from "./collissionEvent";

export class CollisionDetector {
  /** @type {CollisionDetector} */
  static _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new CollisionDetector();
    }

    return this._instance;
  }

  constructor() {
    this.groups = {};
    this.wallArea = [];
    this.roadArea = [];
  }

  addWallArea(area) { 
    this.wallArea.push(area);
  }

  addRoadArea(area) { 
    this.roadArea.push(area);
  }

  /**
   * @param {Array<{tag: string, collideTags: Array<string>}>} filters
   */
  init(filters) {
    this.filters = filters;
    Object.keys(CollisionTag).forEach((key) => {
      var tag = CollisionTag[key];
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
        collider.fire(CollisionEvent.OnCollide, collider2);
        collider2.fire(CollisionEvent.OnCollide, collider);
      }
      else {
        collider.fire(CollisionEvent.NotCollide, collider2);
        collider2.fire(CollisionEvent.NotCollide, collider);
      }
      if (!collider.enabled) {
        return;
      }
    }
  }

  _iscollide(collider1, collider2) {
    let bound1 = collider1.getBound();
    let bound2 = collider2.getBound();
    return bound1.intersects(bound2);
  }

  add(collider) {
    let tag = collider.tag;
    this.groups[tag].push(collider);
  }

  get(tag) { 
    return this.groups[tag];
  }

  reset() {
    this.wallArea = [];
    this.roadArea = [];
  }

  remove(collider) {
    let tag = collider.tag;
    let group = this.groups[tag];
    let index = group.indexOf(group.indexOf(collider));
    if (index >= 0) {
      group.splice(index, 1);
    }
  }
}
