import Canvas from "../06-template/Canvas.js";
import Vector from "../04-vector/Vector.js";
import Tree from "./Tree.js";

const canvas = document.getElementById("canvas");

let tree = null;
let trees = [];

new Canvas(canvas, {
  clearBg: false,
  init: ({ context: ctx, fullWidth, fullHeight }) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    tree = new Tree({
      p: new Vector(),
      angle: -Math.PI / 2
    });
    trees.push(tree);
  },
  draw: ({ context: ctx, fullWidth, fullHeight, time }) => {
    ctx.save();
    ctx.translate(fullWidth / 2, fullHeight);

    trees.forEach((tree) => tree.update(trees, time, ctx));
    trees.forEach((tree) => tree.draw(ctx));

    ctx.restore();
  }
});
