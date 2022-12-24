export default class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(s) {
    return new Vector(this.x * s, this.y * s);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set length(nv) {
    let temp = this.unit.mul(nv);
    this.set(temp.x, temp.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  equal(v) {
    return this.x === v.x && this.y === v.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  get unit() {
    return this.mul(1 / this.length);
  }

  static get ZERO() {
    return new Vector(0, 0);
  }

  static get UP() {
    return new Vector(0, -1);
  }

  static get DOWN() {
    return new Vector(0, 1);
  }

  static get LEFT() {
    return new Vector(-1, 0);
  }

  static get RIGHT() {
    return new Vector(1, 0);
  }

  static DIR(str) {
    if (!str) {
      return Vector.ZERO;
    }
    let type = ("" + str).toUpperCase();
    return Vector[type];
  }

  static DIR_ANGLE(str) {
    switch (str) {
      case "right":
        return 0;
      case "left":
        return PI();
      case "up":
        return PI(-0.5);
      case "down":
        return PI(0.5);
    }
    return 0;
  }
}
