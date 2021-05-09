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
const canvasTemplate = new Canvas(canvas);
