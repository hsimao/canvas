import Vector from "../04-vector/Vector.js";

// 遊戲元件基礎配置
export default class GameObject {
  constructor(ctx, options) {
    let defaultOptions = {
      // canvas
      ctx,
      // 座標
      p: Vector.ZERO,
      // 速度
      v: Vector.ZERO,
      // 加速度
      a: Vector.ZERO,
      // 大小
      size: Vector.ZERO,
      // 元件名稱
      name: "",
      // 元件標記, 分類群組用
      tags: [],
      // 圖像
      graphic: null
    };

    // 合併自定義配置
    Object.assign(defaultOptions, options);
    // 配置配置到該物件內
    Object.assign(this, defaultOptions);
  }

  // 更新
  update() {
    // 位置依據加速度偏移
    this.p = this.p.add(this.v);
    // 速度加上加速度
    this.v = this.v.add(this.a);
  }

  // 繪製
  draw() {
    this.save(() => {
      this.translate(this.p);
      this.setStroke("white");
      this.ctx.strokeRect(0, 0, this.size.x, this.size.y);
      this.setFill("white");
      this.ctx.font = "18px Ariel";
      this.ctx.fillText(`GObj ${this.name}`, 0, -10);
    });
  }

  // 取得邊界點
  get boundaryPoints() {
    // 左上角
    const LT = this.p;
    // 右下角
    const RB = this.p.add(this.size);
    // 左下角
    const LB = new Vector(LT.x, RB.y);
    // 右上角
    const RT = new Vector(RB.x, LT.y);
    // 中心點
    const MM = this.p.add(this.size.mul(0.5));

    return { LT, LB, RB, RT, MM };
  }

  // 是否在範圍內
  inRange(position) {
    const { LT, LB, RB, RT, MM } = this.boundaryPoints;
    const xInRange = position.x > LT.x && position.x < RT.x;
    const yInRange = position.y > LT.y && position.y < RB.y;
    return xInRange && yInRange;
  }

  // 碰撞
  collide(obj) {
    let isCollide = false;
    const points1 = Object.values(this.boundaryPoints);
    const points2 = Object.values(obj.boundaryPoints);

    // 檢查當元素有沒有在傳入元素的範圍內
    points1.forEach((p) => {
      if (obj.inRange(p)) {
        isCollide = true;
      }
    });

    // 檢查傳入元素有沒有在當前元素範圍內
    points2.forEach((p) => {
      if (this.inRange(p)) {
        isCollide = true;
      }
    });

    return isCollide;
  }

  setFill(color) {
    this.ctx.fillStyle = color;
  }

  setStroke(color) {
    this.ctx.strokeStyle = color;
  }

  getVector(args) {
    if (args.length == 1) {
      return args[0];
    } else if (args.length == 2) {
      return new Vector(args[0], args[1]);
    }
  }

  translate(...args) {
    const v = this.getVector(args);
    this.ctx.translate(v.x, v.y);
  }

  save(func) {
    this.ctx.save();
    func();
    this.ctx.restore();
  }
}
