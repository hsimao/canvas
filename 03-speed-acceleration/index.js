const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

let ww, wh, ball;

function updateWindowSize() {
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
}

window.addEventListener("resize", updateWindowSize);

const controls = {
  vx: 0,
  vy: 0,
  ay: 0.6,
  fade: 0.99,
  update: true,
  color: "#fff",
  step: function () {
    ball.update();
  },
  FPS: 30
};

const gui = new dat.GUI();
gui
  .add(controls, "vx", -50, 50)
  .listen()
  .onChange((value) => {
    ball.v.x = value;
  });

gui
  .add(controls, "vy", -50, 50)
  .listen()
  .onChange((value) => {
    ball.v.y = value;
  });

gui
  .add(controls, "ay", -1, 1)
  .step(0.001)
  .listen()
  .onChange((value) => {
    ball.a.y = value;
  });

gui
  .add(controls, "fade", 0, 1)
  .step(0.01)
  .listen()
  .onChange((value) => {
    ball.fade = value;
  });

gui.add(controls, "update").listen();
gui.addColor(controls, "color");
gui.add(controls, "step");
gui.add(controls, "FPS", 1, 120);

function updateGuiControls({ vx, vy, ay }) {
  controls.vx = vx;
  controls.vy = vy;
  controls.ay = ay;
}

class Ball {
  constructor(ctx) {
    this.ctx = ctx;
    this.dragging = false;
    // 半徑
    this.r = 50;

    // 座標
    this.p = {
      x: ww / 2,
      y: wh / 2
    };

    // 速度
    this.v = {
      x: -13,
      y: 3
    };

    // 加速度
    this.a = {
      x: 0,
      y: 1
    };

    // 摩擦力, 讓速度越來越慢
    this.fade = 0.99;
  }

  draw() {
    this.ctx.beginPath();

    this.ctx.save();
    this.ctx.translate(this.p.x, this.p.y);
    this.ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    this.ctx.fillStyle = controls.color;
    this.ctx.fill();
    this.ctx.restore();

    this.drawV();
  }

  update() {
    if (this.dragging) return;

    this.p.x += this.v.x;
    this.p.y += this.v.y;

    this.v.x += this.a.x;
    this.v.y += this.a.y;

    this.v.x *= this.fade;
    this.v.y *= this.fade;

    updateGuiControls({ vx: this.v.x, vy: this.v.y, ay: this.a.y });
    this.checkBoundary();
  }

  // 檢查是否有碰到邊界
  checkBoundary() {
    // 碰到右邊邊界, 將 x 軸加速度反轉, 改為負數
    if (this.p.x + this.r > ww) {
      this.v.x = -Math.abs(this.v.x);
    }

    // 碰到左邊邊界, 將 x 軸加速度反轉, 改為正數
    if (this.p.x - this.r < 0) {
      this.v.x = Math.abs(this.v.x);
    }

    // 碰到底部邊界, 將 y 軸加速度反轉, 改為負數
    if (this.p.y + this.r > wh) {
      this.v.y = -Math.abs(this.v.y);
    }

    // 蹦到上方邊界, 將 y 軸加速度反轉, 改回正數
    if (this.p.y - this.r < 0) {
      this.v.y = Math.abs(this.v.y);
    }
  }

  // 繪製速度線條
  drawV() {
    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.translate(this.p.x, this.p.y);
    this.ctx.scale(3, 3);

    // 繪製 x, y 軸速度軌跡方向線條
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.v.x, this.v.y);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();

    // 繪製 x 軸速度線條
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.v.x, 0);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();

    // 繪製 y 軸速度線條
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, this.v.y);
    this.ctx.strokeStyle = "green";
    this.ctx.stroke();

    this.ctx.restore();
  }
}

function init() {
  this.updateWindowSize();
  ball = new Ball(ctx);
}
init();

function update() {
  if (controls.update) {
    ball.update();
  }
}

setInterval(update, 1000 / 30);

function draw() {
  // 控制殘影, 使用透明度
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, ww, wh);
  ball.draw();

  setTimeout(draw, 1000 / controls.FPS);
}

draw();

let mousePos = { x: 0, y: 0 };

function getDistance(p1, p2) {
  const temp1 = p1.x - p2.x;
  const temp2 = p1.y - p2.y;
  const dist = Math.pow(temp1, 2) + Math.pow(temp2, 2);
  return Math.sqrt(dist);
}

canvas.addEventListener("mousedown", function ({ x, y }) {
  mousePos = { x, y };
  const dist = getDistance(mousePos, ball.p);
  console.log(dist);
  if (dist < ball.r) {
    console.log("ball clicked");
    ball.dragging = true;
  }
});

canvas.addEventListener("mouseup", function (evt) {
  ball.dragging = false;
});

canvas.addEventListener("mousemove", function ({ x, y }) {
  const nowPos = { x, y };
  if (ball.dragging) {
    let dx = nowPos.x - ball.p.x;
    let dy = nowPos.y - ball.p.y;

    // 拖曳中球跟著滑鼠動
    ball.p.x += dx;
    ball.p.y += dy;

    // 放掉滑鼠後, 計算點擊當下與放開後的變化量, 來當成加速度
    ball.v.x = dx;
    ball.v.y = dy;
  }

  // 更新滑鼠樣式, 如果滑鼠在球內, 將滑鼠變成 move 樣式
  const dist = getDistance(nowPos, ball.p);
  if (dist < ball.r) {
    canvas.style.cursor = "move";
  } else {
    canvas.style.cursor = "initial";
  }
});
