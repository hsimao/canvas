import Vector from "./Vector.js";

export default class Snake {
  constructor() {
    this.body = [];
    this.maxLength = 5;
    this.head = new Vector();
    this.speed = new Vector(1, 0);
    this.direction = "Right";
  }

  update() {
    let newHead = this.head.add(this.speed);
    this.body.push(this.head);
    this.head = newHead;

    // 大於 body 上限, 移除尾端格子
    while (this.body.length > this.maxLength) {
      this.body.shift();
    }
  }

  checkBoundary(blockCount) {
    let xInRange = 0 <= this.head.x && this.head.x < blockCount;
    let yInRange = 0 <= this.head.y && this.head.y < blockCount;
    return xInRange && yInRange;
  }

  checkCollisionSelf() {
    return this.body.some((position) => this.head.equal(position));
  }

  setDirection(direction) {
    let target;
    switch (direction) {
      case "Up":
        target = new Vector(0, -1);
        break;
      case "Down":
        target = new Vector(0, 1);
        break;
      case "Left":
        target = new Vector(-1, 0);
        break;
      case "Right":
        target = new Vector(1, 0);
        break;
    }
    if (!target) return;

    // 如果是當前反向將不執行, 蛇不可以往當前方向直接折返
    if (!target.equal(this.speed.mul(-1))) {
      this.speed = target;
    }
  }
}
