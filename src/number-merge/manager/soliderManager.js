import { Entity } from "playcanvas";
import { SpawningEvent } from "../scripts/spawners/spawningEvent";
import { CollisionEvent } from "../../physics/collissionEvent";
import { CollisionTag } from "../../physics/collisionTag";
export const SoliderManagerEvent = Object.freeze({
  Win: "win",
  Lose: "lose",
  PlayerRemoved: "player-removed",
  EnemyRemoved: "enemy-removed",
});
export class SoliderManager extends Entity {
  static _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new SoliderManager();
    }

    return this._instance;
  }

  constructor() {
    super("solider-manager")
    this.soliderEnemies = [];
    this.soliderPlayers = [];
  }

  addSoliderPlayer(solider) {
    this.soliderPlayers.push(solider);
    solider.boxCollider.on(CollisionEvent.OnCollide, (other) => {
      this.onSoliderCollide(other, solider);
    });
    solider.once(SpawningEvent.Despawn, () => {
      this.fire(SoliderManagerEvent.PlayerRemoved, solider);
    });
  }

  addSoliderEnemy(solider) { 
    this.soliderEnemies.push(solider);
    solider.boxCollider.on(CollisionEvent.OnCollide, (other) => {
      this.onSoliderCollide(other, solider);
    });
    solider.once(SpawningEvent.Despawn, () => {
      this.fire(SoliderManagerEvent.EnemyRemoved, solider);
    });
  }

  onSoliderCollide(other, solider) {
    if (other.tag !== solider.boxCollider.tag) {
      if (other.tag === CollisionTag.SoliderEnemy) {
        this.removeSoliderEnemy(other.entity);
        if (this.soliderEnemies.length <= 0) {
          this.onWin();
        }
      } else {
        this.removeSoliderPlayer(other.entity);
        if (this.soliderPlayers.length <= 0) {
          this.onLose();
        }
      }
      other.entity.despawn();
    }
  }
  
  removeSoliderEnemy(solider) { 
    let index = this.soliderEnemies.indexOf(solider);
    if (index > -1) {
      this.soliderEnemies.splice(index, 1);
    }
  }

  removeSoliderPlayer(solider) { 
    let index = this.soliderPlayers.indexOf(solider);
    if (index > -1) {
      this.soliderPlayers.splice(index, 1);
    }
  }

  clear() {
    this.soliderEnemies = [];
    this.soliderPlayers = [];
  }

  onWin() {
    this.soliderEnemies.forEach(solider => {
      solider.controller.onLose();
    });
    this.soliderPlayers.forEach(solider => {
      solider.controller.onWin();
    });
    this.fire(SoliderManagerEvent.Win);
  }

  offAllEvent() {
    this.off();
  }

  onLose() { 
    this.soliderEnemies.forEach(solider => {
      solider.controller.onWin();
    });
    this.soliderPlayers.forEach(solider => {
      solider.controller.onLose();
    });
    this.fire(SoliderManagerEvent.Lose);
  }

  findNearestSoliderEnemy(pos) { 
    let nearest = null;
    let minDistance = Infinity;
    this.soliderEnemies.forEach(solider => {
      let distance = solider.getLocalPosition().distance(pos);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = solider;
      }
    });
    return nearest;
  }

  findNearestSoliderPlayer(pos) { 
    let nearest = null;
    let minDistance = Infinity;
    this.soliderPlayers.forEach(solider => {
      let distance = solider.getLocalPosition().distance(pos);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = solider;
      }
    });
    return nearest;
  }
}