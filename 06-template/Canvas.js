export default class Canvas {
  constructor(canvas, width = 0, height = 0) {
    if (!canvas) {
      throw new Error("canvas not find!");
    }

    this.canvas = canvas;
    this.context = null;
    this.width = width;
    this.height = height;
    this.time = 0;
    this.updateFPS = 30;
    this.showMouse = true;

    window.addEventListener("load", () => this.loaded());
  }

  initCanvas() {
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  init() {}

  loaded() {
    this.initCanvas();
    this.init();
    requestAnimationFrame(() => this.draw());
    setInterval(() => this.update(), 1000 / this.updateFPS);
  }

  update() {
    this.time++;
  }

  draw() {
    requestAnimationFrame(() => this.draw());
  }
}
