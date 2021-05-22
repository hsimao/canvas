import Canvas from "../06-template/Canvas.js";
import Vector from "../04-vector/Vector.js";

const canvas = document.getElementById("canvas");

const degToPI = Math.PI / 180;

class Circle {
  constructor(args) {
    let options = {
      p: new Vector(0, 0),
      r: 100,
      color: "white",
      ramp: 0,
      verticaal: false,
      lineTo: (obj, i) => true,
      getWidth: (obj, i) => 1,
      anglePan: (obj, i) => 0,
      getVerticalWidth: (obj, i) => 2
    };

    Object.assign(options, args);
    Object.assign(this, options);
  }

  draw(ctx, time) {
    for (let i = 1; i <= 360; i++) {
      const angle1 = i + this.anglePan();
      const angle2 = i - 1 + this.anglePan();

      const useR = this.r + this.ramp * Math.sin(i / 10);
      const useR2 = this.r + this.ramp * Math.sin((i - 1) / 10);
      const x1 = useR * Math.cos(angle1 * degToPI);
      const y1 = useR * Math.sin(angle1 * degToPI);

      const x2 = useR2 * Math.cos(angle2 * degToPI);
      const y2 = useR2 * Math.sin(angle2 * degToPI);

      if (this.lineTo(this, i)) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.getWidth(this, i);
        ctx.stroke();
      }

      // 繪製垂直線段
      if (this.vertical) {
        const l = this.getVerticalWidth(this, i);
        const x3 = (useR + l) * Math.cos(angle1 * degToPI);
        const y3 = (useR + l) * Math.sin(angle1 * degToPI);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x3, y3);
        ctx.strokeStyle = this.color;
        ctx.stroke();
      }
    }
  }
}

const circles = [];
let time = 0;

new Canvas(canvas, {
  showMouse: true,
  init: ({ context: ctx, fullWidth, fullHeight }) => {
    circles.push(
      new Circle({
        r: 150,
        color: "rgba(255, 255, 255, 0.4)"
      })
    );

    // 虛線
    circles.push(
      new Circle({
        r: 220,
        lineTo: (obj, i) => i % 2 === 0
      })
    );

    // 左右小段缺口圓圈
    circles.push(
      new Circle({
        r: 80,
        lineTo: (obj, i) => !(i % 180 < 30)
      })
    );

    // 波形圓圈
    circles.push(
      new Circle({
        r: 320,
        ramp: 15,
        color: "rgba(255, 255, 255, 0.8)"
      })
    );

    // 繪製不同寬度的線條
    circles.push(
      new Circle({
        r: 190,
        getWidth: (obj, i) => (i % 150 < 50 ? 5 : 1),
        // 左右旋轉
        anglePan: (obj, i) => {
          return -40 * Math.sin(time / 200);
        },
        color: "rgba(255, 255, 255, 0.8)"
      })
    );

    // 繪製刻度圓圈
    circles.push(
      new Circle({
        r: 300,
        lineTo: () => false,
        vertical: true,
        getVerticalWidth: (obj, i) => {
          if (i % 10 === 0) return 10;
          if (i % 5 === 0) return 5;
          return 2;
        },
        // 左右旋轉
        anglePan: (obj, i) => {
          return 40 * Math.sin(time / 200);
        },
        color: "rgba(255, 255, 255, 0.8)"
      })
    );

    // 七個刻度線條
    circles.push(
      new Circle({
        r: 280,
        lineTo: (obj, i) => i % 50 === 0,
        getWidth: (obj, i) => 10,
        anglePan: (obj, i) => (-time / 20) % 5,
        color: "rgba(255, 255, 255, 0.8)"
      })
    );
  },
  draw: ({ context: ctx, fullWidth, fullHeight, time, mousePosition }) => {
    ctx.save();
    ctx.translate(fullWidth / 2, fullHeight / 2);
    circles.forEach((circle) => {
      ctx.save();
      // 圈圈依據滑鼠位置與中心間距離來進行偏移, 半徑越小移動幅度越大
      const pan = mousePosition
        .sub(new Vector(fullWidth / 2, fullHeight / 2))
        .mul(2 / circle.r);
      ctx.translate(pan.x, pan.y);
      circle.draw(ctx, time);
      ctx.restore();
    });

    // 顯示時間區塊
    ctx.fillStyle = "white";
    ctx.fillRect(0, -20, 120, 20);
    ctx.fillStyle = "black";
    ctx.fillText(Date.now(), 5, -5);

    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    // 取得小時的角度
    const angleHour = ((degToPI * 360) / 12) * hours - Math.PI / 2;

    // 繪製時針
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50 * Math.cos(angleHour), 50 * Math.sin(angleHour));
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.stroke();

    // 取得分的角度
    const angleMinute = ((degToPI * 360) / 60) * minutes - Math.PI / 2;

    // 繪製分針
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100 * Math.cos(angleMinute), 100 * Math.sin(angleMinute));
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.stroke();

    // 取得秒的角度
    const angleSecond = ((degToPI * 360) / 60) * seconds - Math.PI / 2;

    // 繪製秒針
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(140 * Math.cos(angleSecond), 140 * Math.sin(angleSecond));
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.restore();

    // 繪製上下左右 四個十字叉叉
    const crosses = [
      new Vector(50, 50),
      new Vector(fullWidth - 50, 50),
      new Vector(50, fullHeight - 50),
      new Vector(fullWidth - 50, fullHeight - 50)
    ];

    crosses.forEach((cross) => {
      ctx.beginPath();
      ctx.save();
      ctx.translate(cross.x, cross.y);
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 10);
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();
    });
  },
  update: () => time++
});
