import Vector from "../04-vector/Vector.js";
import Canvas from "./Canvas.js";

// 控制
const controls = {
  angle: 0,
  length: 200,
  count: 3,
  showSubPlanet: true,
};

const gui = new dat.GUI();

gui.add(controls, "angle", 0, 360).step(0.01);
gui.add(controls, "length", 0, 250).step(0.01);
gui.add(controls, "count", 1, 200).step(1);
gui.add(controls, "showSubPlanet");

const degToPI = Math.PI / 180;

const canvas = document.getElementById("canvas");

// 將半徑與角度轉換成為座標
const toPoint = (r, angle) => {
  return new Vector(r * Math.cos(angle), r * Math.sin(angle));
};

new Canvas(canvas, {
  showMouse: true,
  draw: ({ context: ctx, fullWidth, fullHeight, time }) => {
    ctx.beginPath();
    ctx.moveTo(0, fullHeight / 2);
    ctx.lineTo(fullWidth, fullHeight / 2);
    ctx.moveTo(fullWidth / 2, 0);
    ctx.lineTo(fullWidth / 2, fullHeight);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
    ctx.stroke();

    ctx.save();
    ctx.translate(fullWidth / 2, fullHeight / 2);

    // 使用 cos 與 sin 算出圓形幅度的 x 軸跟 y 軸
    // 極坐標 => x, y
    const x = controls.length * Math.cos(controls.angle * degToPI);
    const y = controls.length * Math.sin(controls.angle * degToPI);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    const points = [];
    const angleSpan = (Math.PI * 2) / controls.count;
    for (let i = 0; i < controls.count; i++) {
      const angle = controls.angle * degToPI + i * angleSpan;
      const r = controls.length;
      points.push({ angle, r });
    }

    points.forEach((p, index) => {
      ctx.beginPath();
      const x = p.r * Math.cos(p.angle);
      const y = p.r * Math.sin(p.angle);
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();

      // 在圓形點上繪製第二層旋轉座標
      if (controls.showSubPlanet) {
        const s = { r: 50, angle: index * 10 + time / 20 };
        ctx.beginPath();
        const sx = s.r * Math.cos(s.angle);
        const sy = s.r * Math.sin(s.angle);
        ctx.arc(sx + x, sy + y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(sx + x, sy + y);
        ctx.stroke();
      }
    });

    // 連接每個點的線條
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    points.forEach((p) => {
      const pxy = toPoint(p.r, p.angle);
      ctx.lineTo(pxy.x, pxy.y);
    });

    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  },
});
