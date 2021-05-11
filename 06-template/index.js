// import Vector from "../04-vector/index.js";
import Canvas from "./Canvas.js";

// 控制
const controls = {
  value: 0
};

const gui = new dat.GUI();

gui
  .add(controls, "value", -2, 2)
  .step(0.01)
  .onChange((value) => {
    console.log(value);
  });

const canvas = document.getElementById("canvas");

// demo
const canvasTemplate = new Canvas(canvas, {
  showMouse: true,
  draw: (ctx, time) => {
    ctx.save();

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.fillStyle = "red";
    ctx.beginPath();
    // 使用自定義方法 circle
    ctx.circle({ x: 0, y: 0 }, 30);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 200);
    ctx.arc(100, 150, 50, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    // 使用自定義方法 line
    ctx.line({ x: -100, y: -100 }, { x: -100, y: 0 });
    ctx.stroke();

    ctx.restore();
  }
});
