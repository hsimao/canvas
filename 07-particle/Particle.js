import Vector from "../04-vector/Vector.js";

export default class Particle {
  constructor(args) {
    const options = {
      ctx: null,
      p: new Vector(),
      v: new Vector(1, 0),
      a: new Vector(),
      ay: 0,
      r: 30,
      color: "#fff",
      fade: 0.99
    };

    Object.assign(options, args);
    Object.assign(this, options);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.p.x, this.p.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update({ ay, p, v }) {
    if (ay) this.ay = ay;
    if (p) this.p = p;
    if (v) this.v = v;
    // 速度
    this.p = this.p.add(this.v);

    // 加速度
    this.v = this.v.add(this.a);

    // 摩擦力
    this.v = this.v.mul(0.99);

    // 排斥力
    this.v.move(0, this.ay);

    // 慢慢縮小
    this.r *= this.fade;

    this.handleRebound();
  }

  // 反彈
  handleRebound() {
    if (this.width) {
      if (this.p.x + this.r > this.width) {
        this.v.x = -Math.abs(this.v.x);
      }
      if (this.p.x - this.r < 0) {
        this.v.x = Math.abs(this.v.x);
      }
    }

    if (this.height) {
      if (this.p.y + this.r > this.height) {
        this.v.y = -Math.abs(this.v.y);
      }
      if (this.p.y - this.r < 0) {
        this.v.y = Math.abs(this.v.y);
      }
    }
  }
}
