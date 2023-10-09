export class Circle {

  static createCircle(center, point) {
    var circle = new Circle();
    circle.center = center;
    circle.point = point;
    return circle;
  }

  /**
   * @param {Vec3} center
   */
  getTransformed() {
    let res = new Circle();
    let center = this.circle.center;
    let point = this.circle.point;
    let radius = center.getPosition().distance(point.getPosition());
    res.radius = radius;
    res.center = center.getPosition();
    return res;
  }
}
