import Vector from "./Vector.js";
import Snake from "./Snake.js";

export default class Game {
  constructor(canvas, { onStart, onEnd }) {
    this.canvas = canvas;
    this.ctx = null;
    this.blockWidth = 12;
    this.borderWidth = 2;
    this.blockCount = 40;
    this.speed = 30;
    this.snake = new Snake();
    this.foods = [];
    this.start = false;
    this.onStart = onStart;
    this.onEnd = onEnd;

    this.init();
  }

  init() {
    this.ctx = this.canvas.getContext("2d");
    this.initGameSzie();
    this.render();
    this.update();
    this.generateFood();
    this.listenKeyboard();
  }

  initGameSzie() {
    const totalBorderWidth = this.borderWidth * (this.blockCount + 1);
    const totalBricksWidth = this.blockCount * this.blockWidth;

    this.canvas.width = totalBorderWidth + totalBricksWidth;
    this.canvas.height = totalBorderWidth + totalBricksWidth;
  }

  // 取得格子位置, 將格座標轉換為 px x, y 座標
  getPosition(blockX, blockY) {
    // 格子間隙
    const borderXWidth = (blockX + 1) * this.borderWidth;
    const borderYWidth = (blockY + 1) * this.borderWidth;

    return new Vector(
      blockX * this.blockWidth + borderXWidth,
      blockY * this.blockWidth + borderYWidth
    );
  }

  startGame() {
    this.start = true;
    this.snake = new Snake();
    this.playSound("C#5", -20);
    this.playSound("E5", -20, 200);

    if (this.onStart) {
      this.onStart();
    }
  }

  endGame() {
    this.start = false;

    this.playSound("A3");
    this.playSound("E2", 0, 200);
    this.playSound("A2", 0, 400);

    if (this.onEnd) {
      this.onEnd({ score: (this.snake.maxLength - 5) * 10 });
    }
  }

  playSound(note, volume = -20, when = 0) {
    setTimeout(() => {
      const synth = new Tone.Synth().toDestination();
      synth.volume.value = volume;
      synth.triggerAttackRelease(note, "8n");
    }, when);
  }

  // 繪製格子
  drawBlock(blockPosition, color) {
    this.ctx.fillStyle = color;
    const { x, y } = this.getPosition(blockPosition.x, blockPosition.y);
    this.ctx.fillRect(x, y, this.blockWidth, this.blockWidth);
  }

  // 繪製波紋, 吃到食物的動畫效果
  drawEffect(x, y) {
    let r = 2;
    const position = this.getPosition(x, y);
    const effect = () => {
      r++;

      // 將半徑轉成透明度 2 ~ 100 => 0 ~ 1
      const transparency = (100 - r) / 100;
      this.ctx.strokeStyle = `rgba(255, 0, 0, ${transparency})`;
      this.ctx.beginPath();
      const centerX = position.x + this.blockWidth / 2;
      const centerY = position.y + this.blockWidth / 2;
      this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      this.ctx.stroke();

      // 循環繪製到超過半徑 100
      if (r < 100) {
        requestAnimationFrame(effect);
      }
    };
    requestAnimationFrame(effect);
  }

  render() {
    this.renderBackground();
    this.renderBlock();
    this.renderSnake();
    this.renderFoods();

    requestAnimationFrame(() => this.render());
  }

  renderBackground() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderBlock(color = "rgba(255, 255, 255, 0.03)") {
    for (let x = 0; x < this.blockCount; x++) {
      for (let y = 0; y < this.blockCount; y++) {
        this.drawBlock({ x, y }, color);
      }
    }
  }

  renderSnake(color = "white") {
    this.snake.body.forEach((sankePosition) => {
      this.drawBlock(sankePosition, color);
    });
  }

  renderFoods(color = "red") {
    this.foods.forEach((position) => this.drawBlock(position, color));
  }

  handleEndGame() {
    if (this.snake.checkCollisionSelf()) {
      this.endGame();
    }

    if (!this.snake.checkBoundary(this.blockCount)) {
      this.endGame();
    }
  }

  update() {
    if (this.start) {
      this.playSound("A2");
      this.snake.update();
      this.handleSankeEatFood();
      this.handleEndGame();
    }

    setTimeout(() => {
      this.update();
    }, this.getFPSBySnakeLength());
  }

  // 蛇越長, 速度越快
  getFPSBySnakeLength() {
    this.speed = Math.sqrt(this.snake.body.length * 2) + 5;
    return parseInt(1000 / this.speed);
  }

  // 產生食物
  generateFood() {
    this.foods = [];

    const x = parseInt(Math.random() * this.blockCount);
    const y = parseInt(Math.random() * this.blockCount);
    this.foods.push(new Vector(x, y));
    this.drawEffect(x, y);
    this.playSound("E5");
    this.playSound("A5", -20, 50);
  }

  // 蛇吃到食物邏輯
  handleSankeEatFood() {
    this.foods.forEach((food, index) => {
      if (this.snake.head.equal(food)) {
        this.snake.maxLength++;
        this.foods.splice(index, 1);
        this.generateFood();
      }
    });
  }

  listenKeyboard() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  removeListeneKeyboard() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = (event) => {
    if (event.key) {
      // ArrowDown => Down
      const direction = event.key.replace("Arrow", "");
      this.snake.setDirection(direction);
    }
  };
}
