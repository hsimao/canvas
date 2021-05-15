import Vector from "../04-vector/Vector.js";

export default class Canvas {
  constructor(
    canvas,
    {
      showMouse = false,
      clearBg = true,
      width = 0,
      height = 0,
      draw,
      init,
      update,
      updateFPS = 30
    }
  ) {
    if (!canvas) {
      throw new Error("canvas not find!");
    }

    this.canvas = canvas;
    this.context = null;
    this.width = width;
    this.height = height;
    this.showMouse = showMouse;
    this.clearBg = clearBg;
    this.fullWidth = window.innerWidth;
    this.fullHeight = window.innerHeight;
    this.time = 0;
    this.updateFPS = updateFPS;

    this.drawFn = draw;
    this.initFn = init;
    this.updateFn = update;

    this.bgColor = "black";

    // mouse event config
    this.mousePosition = new Vector(0, 0);
    this.mousePositionDown = new Vector(0, 0);
    this.mousePositionUp = new Vector(0, 0);
    this.composeHandleMousemove = null;
    this.composeHandleMouseup = null;
    this.composeHandleMousedown = null;

    window.addEventListener("load", () => this.loaded());
  }

  initCanvas() {
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width || this.fullWidth;
    this.canvas.height = this.height || this.fullHeight;
  }

  onResize() {
    if (!this.width && !this.height) {
      window.addEventListener("resize", this.handleResize, false);
    }
  }

  offResize() {
    window.removeEventListener("resize", this.handleResize, false);
  }

  handleResize() {
    this.fullWidth = this.canvas.width = window.innerWidth;
    this.fullHeight = this.canvas.height = window.innerHeight;
  }

  // 邏輯初始化
  init() {
    if (this.initFn) this.initFn(this);
  }

  // 事件監聽設置
  initOnEvent() {
    this.onResize();

    if (this.showMouse) {
      this.onMousemove();
    }
  }

  // 頁面載入
  loaded() {
    this.initCanvas();
    this.initOnEvent();
    this.initDrawMathods();
    this.init();
    requestAnimationFrame(() => this.draw());
    setInterval(() => this.update(), 1000 / this.updateFPS);
  }

  // canvas 邏輯更新
  update() {
    this.time++;
    if (this.updateFn) this.updateFn(this);
  }

  clearBackground() {
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(
      0,
      0,
      this.width || this.fullWidth,
      this.height || this.fullHeight
    );
  }

  // 畫面繪製
  draw() {
    if (this.clearBg) {
      this.clearBackground();
    }
    if (this.drawFn) this.drawFn(this);
    if (this.showMouse) this.drawMousePosition();

    requestAnimationFrame(() => this.draw());
  }

  // canvas draw methods start
  initDrawMathods() {
    this.context.circle = (...arg) => this.circle(...arg);
    this.context.line = (...arg) => this.line(...arg);
  }

  circle({ x, y }, r) {
    this.context.arc(x, y, r, 0, Math.PI * 2);
  }

  line(v1, v2) {
    this.context.moveTo(v1.x, v1.y);
    this.context.lineTo(v2.x, v2.y);
  }

  drawMousePosition() {
    this.context.fillStyle = "red";
    this.context.beginPath();
    this.circle(this.mousePosition, 3);
    this.context.fill();

    this.context.save();
    this.context.beginPath();
    this.context.translate(this.mousePosition.x, this.mousePosition.y);
    this.context.strokeStyle = "red";
    this.context.fillText(this.mousePosition, 10, -10);

    const length = 20;
    this.line(new Vector(-length, 0), new Vector(length, 0));
    this.context.rotate(Math.PI / 2);
    this.line(new Vector(-length, 0), new Vector(length, 0));

    this.context.stroke();
    this.context.restore();
  }
  // canvas draw methods end

  // mouse event logic start
  onMousemove(fn) {
    this.composeHandleMousemove = fn
      ? (event) => this.handleMousemove(event, fn)
      : this.handleMousemove;
    window.addEventListener("mousemove", this.composeHandleMousemove, false);
  }

  onMouseup(fn) {
    this.composeHandleMouseup = fn
      ? (event) => this.handleMouseup(event, fn)
      : this.handleMouseup;
    window.addEventListener("mouseup", this.composeHandleMouseup, false);
  }

  onMousedown(fn) {
    this.composeHandleMousedown = fn
      ? (event) => this.handleMousedown(event, fn)
      : this.handleMousedown;
    window.addEventListener("mousedown", this.composeHandleMousedown, false);
  }

  offMousemove() {
    window.removeEventListener("mousemove", this.composeHandleMousemove, false);
  }

  offMouseup() {
    window.removeEventListener("mouseup", this.composeHandleMouseup, false);
  }

  offMousedown() {
    window.removeEventListener("mousedown", this.composeHandleMousedown, false);
  }

  handleMousemove = (event, fn) => {
    this.mousePosition.set(event.x, event.y);
    if (fn) fn();
  };

  handleMouseup = (event, fn) => {
    this.mousePosition.set(event.x, event.y);
    this.mousePositionUp = this.mousePosition.clone();
    if (fn) fn();
  };

  handleMousedown = (event, fn) => {
    this.mousePosition.set(event.x, event.y);
    this.mousePositionDown = this.mousePosition.clone();
    if (fn) fn();
  };
  // mouse event logic end
}
