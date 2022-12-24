import Canvas from "../06-template/Canvas.js";
import Vector from "../04-vector/Vector.js";
import GameObject from "./GameObject.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";
import Scene from "./Scene.js";

const canvas = document.getElementById("canvas");

// 繪製子彈
const drawBullet = (ctx, scene) => {
  const plane = scene.getChildByName("player");

  if (time % 20 === 0) {
    // 左側子彈
    const bulletLeft = new Bullet(ctx, {
      p: plane.p,
      tags: ["bullet"]
    });

    // 右側子彈
    const bulletRight = new Bullet(ctx, {
      p: plane.p.add(new Vector(plane.size.x, 0)),
      tags: ["bullet"]
    });

    scene.addChild([bulletLeft, bulletRight]);
  }
};

// 處理子彈跟飛機碰撞邏輯
const handleBulletWithEnemyCollide = (scene) => {
  // 取出所有敵人、子彈
  const allBullets = scene.getChildrenByTag("bullet");
  const allEnemies = scene.getChildrenByTag("enemy");

  // 檢查子彈跟敵人碰撞
  allEnemies.forEach((enemy) => {
    allBullets.forEach((bullet) => {
      // 子彈打到敵人
      const isCollide = enemy && bullet && enemy.collide(bullet);
      if (isCollide) {
        scene.removeChild(enemy);
        scene.removeChild(bullet);
      }
    });
  });
};

let time = 0;
let scene;
new Canvas(canvas, {
  init: ({ context: ctx, fullWidth, fullHeight }) => {
    scene = new Scene();

    const player = new Player(ctx, {
      p: new Vector(50, fullHeight - 100),
      name: "player"
    });
    scene.addChild(player);

    // 產生 5 排敵人, 一排 10 位
    for (let i = 0; i < 10; i++) {
      for (let o = 0; o < 5; o++) {
        const enemy = new Enemy(ctx, {
          p: new Vector(i * 100, o * 70 + 50),
          // 速度, 向下移動
          v: new Vector(0, 0.1),
          name: "enemy",
          tags: ["enemy", "enemy_flock"]
        });
        scene.addChild(enemy);
      }
    }
  },
  draw: ({ context: ctx, fullWidth, fullHeight, time, mousePosition }) => {
    scene.draw();
  },
  update: ({ context: ctx }) => {
    time++;
    scene.update();

    // 子彈
    drawBullet(ctx, scene);

    // 子彈打到敵人
    handleBulletWithEnemyCollide(scene);
  }
});
