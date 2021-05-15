import Vector from "../04-vector/Vector.js";
import Canvas from "../06-template/Canvas.js";
import Particle from "./Particle.js";

// 控制
const controls = {
  count: 1,
  ay: 0.6,
  fade: 0.99,
  v: 10
};

const gui = new dat.GUI();

gui
  .add(controls, "count", 1, 30)
  .step(1)
  .onChange((value) => {
    console.log(value);
  });
gui.add(controls, "ay", -1, 1).step(0.01);
gui.add(controls, "fade", 0, 1).step(0.01);
gui.add(controls, "v", 0, 30).step(0.01);

let particles = [];

const canvas = document.getElementById("canvas");
// demo
const canvasTemplate = new Canvas(canvas, {
  showMouse: true,
  updateFPS: 30,
  init: () => {
    // const particle = new Particle({ ctx });
  },
  draw: ({ context: ctx, time }) => {
    particles.forEach((p) => p.draw(ctx));
  },
  update: ({ time, mousePosition, fullWidth, fullHeight }) => {
    particles = particles.concat(
      Array.from(
        { length: controls.count },
        () =>
          new Particle({
            color: `rgb(255,
            ${parseInt(Math.random() * 255)},
            ${parseInt(Math.random() * 150)})`,
            p: mousePosition.clone(),
            // 撒花粒子速度效果
            v: new Vector(
              Math.random() * controls.v - 5,
              Math.random() * controls.v - 5
            ),
            ay: controls.ay,
            fade: controls.fade,
            width: fullWidth,
            height: fullHeight
          })
      )
    );

    // particles = Array.from(
    //   { length: controls.count },
    //   () =>
    //     new Particle({
    //       color: `rgb(255,
    //         ${parseInt(Math.random() * 255)},
    //         ${parseInt(Math.random() * 150)})`,
    //       p: mousePosition.clone(),
    //       // 撒花粒子速度效果
    //       v: new Vector(
    //         Math.random() * controls.v - 5,
    //         Math.random() * controls.v - 5
    //       ),
    //       ay: controls.ay,
    //       fade: controls.fade,
    //       width: fullWidth,
    //       height: fullHeight
    //     })
    // );

    particles.forEach((p) =>
      p.update({ ay: controls.ay, fade: controls.fade })
    );

    // 刪除半徑小於 0.1 的粒子實例
    particles = particles.filter((p) => {
      return p.r > 0.5;
    });
    // console.log("particles.length", particles.length);
  }
});

setTimeout(() => {
  console.log("particles length", particles);
}, 2000);

setTimeout(() => {
  console.log("particles length", particles);
}, 4000);

setTimeout(() => {
  console.log("particles length", particles);
}, 10000);
