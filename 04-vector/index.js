import Vector from "./Vector.js";

const a = new Vector(4, 0);
const b = new Vector(0, 3);

console.log("a angle", a.angle);
console.log("b angle", b.angle);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mousePos;
let ww = (canvas.width = window.innerWidth);
let wh = (canvas.height = window.innerHeight);

function drawVector(v, trans) {
  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.save();

  ctx.rotate(v.angle);
  ctx.fillText(v, v.length / 2, 10);
  ctx.lineTo(v.length, 0);
  ctx.lineTo(v.length - 5, -4);
  ctx.lineTo(v.length - 5, 4);
  ctx.lineTo(v.length, 0);
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
