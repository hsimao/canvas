export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(s) {
    return new Vector(this.x * s, this.y * s);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
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

  angle() {
    return Math.atan2(this.y, this.x);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
const a = new Vector(4, 0);
const b = new Vector(0, 3);

console.log("a angle", a.angle());
console.log("b angle", b.angle());

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mousePos;
ww = canvas.width = window.innerWidth;
wh = canvas.height = window.innerHeight;

function drawVector(v, trans) {
  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.save();

  ctx.rotate(v.angle());
  ctx.fillText(v, v.length() / 2, 10);
  ctx.lineTo(v.length(), 0);
  ctx.lineTo(v.length() - 5, -4);
  ctx.lineTo(v.length() - 5, 4);
  ctx.lineTo(v.length(), 0);
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.restore();

  if (trans) {
    ctx.translate(v.x, v.y);
  }
}

function draw() {
  ctx.clearRect(0, 0, ww, wh);

  // 以中心為基準, 畫線到當前滑鼠位置
  const c = new Vector(ww / 2, wh / 2);
  if (mousePos) {
    ctx.save();
    ctx.translate(c.x, c.y);
    // 限制為固定長度 100 的線條
    // const md = mousePos.sub(c);
    // drawVector(md.mul(1 / md.length()).mul(100), false);

    drawVector(mousePos.sub(c), false);
    ctx.restore();
  }
}
setInterval(draw, 30);

canvas.addEventListener("mousemove", (event) => {
  mousePos = new Vector(event.x, event.y);
});
