import Vector from "../04-vector/Vector.js";
import GameObject from "./GameObject.js";

// 子彈
export default class Bullet extends GameObject {
  constructor(ctx, options) {
    super(ctx, options);

    let defaultOptions = {
      // 大小
      size: new Vector(10, 10),
      // 速度, 向上移動
      v: new Vector(0, -10)
    };

    // 合併自定義配置
    Object.assign(defaultOptions, options);
    // 配置配置到該物件內
    Object.assign(this, defaultOptions);
  }
}
