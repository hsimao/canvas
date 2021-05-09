export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
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

  length(v) {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  equal(v) {
    return this.x === v.x && this.y === v.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}
