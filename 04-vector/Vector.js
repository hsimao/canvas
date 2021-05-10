export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  get unit() {
    return this.mul(1 / this.length);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
