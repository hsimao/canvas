import Vector from "../04-vector/Vector.js";

export default class Tree {
  constructor(args) {
    const options = {
      p: new Vector(0, 0),
      angle: -Math.PI / 2,
      speed: 3,
      width: 10,
      time: 0
    };

    Object.assign(options, args);
    Object.assign(this, options);
  }

  draw(ctx) {
    if (this.width > 0) {
      ctx.beginPath(this.p.x, this.p.y);
      ctx.arc(this.p.x, this.p.y, this.width, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  isSplit(time) {
    return (
      Math.random() < 0.5 + this.width / 50 &&
      time > 15 &&
      time % 15 === 0 &&
      this.width > 0.5
    );
  }

  isDrawLeaf() {
    return this.width > 0.1 && this.width < 2 && Math.random() < 0.1;
  }

  drawLeaf(ctx) {
    ctx.beginPath();
    ctx.arc(this.p.x, this.p.y, Math.random() * 4, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 50}, 80%, 50%)`;
    ctx.fill();
  }

  createTree(angle) {
    return new Tree({
      angle,
      p: this.p.clone(),
      speed: this.speed / (1.2 + Math.random()),
      width: this.width * (0.45 + 0.5 * Math.random())
    });
  }

  update(trees, time, ctx) {
    this.v = new Vector(Math.cos(this.angle), Math.sin(this.angle)).mul(
      this.speed
    );
    this.p = this.p.add(this.v);
    this.width *= Math.random() * 0.02 + 0.98;

    // 分裂
    if (this.isSplit(time)) {
      // 改變成長角度
      this.angle += (Math.random() - 0.5) / 5;

      // 產生新的 tree
      if (Math.random() < 0.5) {
        trees.push(this.createTree(this.angle + (Math.random() - 0.5) / 2));
      } else {
        trees.push(this.createTree(this.angle + (Math.random() - 0.5) / 2));
        trees.push(this.createTree(this.angle + (Math.random() - 0.5) / 2));
        this.width = 0;
      }

      if (Math.random() < 0.3) {
        this.width = 0;
      }
    }

    // 隨機畫上葉子
    if (this.isDrawLeaf()) {
      this.drawLeaf(ctx);
    }
  }
}
