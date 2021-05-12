import Vector from "../04-vector/Vector.js";
import Canvas from "./Canvas.js";

// 控制
const controls = {
  value: 0,
};

const gui = new dat.GUI();

gui
  .add(controls, "value", -2, 2)
  .step(0.01)
  .onChange((value) => {
    console.log(value);
  });

const degToPI = Math.PI / 180;

// 敵人參數
const enemies = [
  { r: 100, angle: 45 },
  { r: 50, angle: -50 },
  { r: 250, angle: 160 },
  { r: 140, angle: -120 },
];

const canvas = document.getElementById("canvas");

// 檢查是否在扇形範圍內
const checkRange = (moseAngle, mouseDistance, p) => {
  const angleInRange = Math.abs(p.angle * degToPI - moseAngle) < 10 * degToPI;
  const distanceInRange = mouseDistance >= p.r;
  return distanceInRange && angleInRange;
};

// demo
const canvasTemplate = new Canvas(canvas, {
  showMouse: true,
  draw: ({ context: ctx, fullWidth, fullHeight, mousePosition }) => {
    ctx.beginPath();
    ctx.moveTo(fullWidth / 2, 0);
    ctx.lineTo(fullWidth / 2, fullHeight);
    ctx.moveTo(0, fullHeight / 2);
    ctx.lineTo(fullWidth, fullHeight / 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();

    ctx.save();
    ctx.translate(fullWidth / 2, fullHeight / 2);

    // 中心點跟滑鼠之間的距離座標
    const delta = mousePosition.sub(new Vector(fullWidth / 2, fullHeight / 2));
    // 角度
    const mouseAngle = delta.angle;
    // 長度
    const mouseDistance = delta.length;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(delta.x, delta.y);
    ctx.stroke();

    // 依據中心點與滑鼠的距離畫出對應半徑的圓型
    ctx.beginPath();
    ctx.arc(0, 0, mouseDistance, 0, Math.PI * 2);
    ctx.stroke();

    // 繪製扇型
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const lightR = mouseDistance;
    ctx.save();
    ctx.rotate(mouseAngle - 10 * degToPI);
    ctx.lineTo(lightR, 0);
    ctx.arc(0, 0, mouseDistance, 0, 20 * degToPI);
    ctx.rotate(20 * degToPI);
    ctx.lineTo(lightR, 0);
    ctx.fillStyle = "#ffcc60";
    ctx.fill();
    ctx.restore();

    // 繪製雷達目標圈圈
    enemies.forEach((p) => {
      ctx.save();
      ctx.beginPath();
      ctx.rotate(p.angle * degToPI);
      ctx.translate(p.r, 0);
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      const isRange = checkRange(mouseAngle, mouseDistance, p);
      ctx.fillStyle = isRange ? "red" : "white";
      ctx.fill();
      ctx.restore();
    });

    // 半徑、角度顯示文字
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Roboto";
    ctx.fillText(`${parseInt(mouseAngle / degToPI)}度`, 10, -10);
    ctx.fillText(`半徑：${mouseDistance}`, mouseDistance + 10, 10);

    ctx.restore();
  },
});
