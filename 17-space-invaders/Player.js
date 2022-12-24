import Vector from "../04-vector/Vector.js";
import GameObject from "./GameObject.js";

// 玩家飛機
export default class Player extends GameObject {
  constructor(ctx, options) {
    super(ctx, options);

    let defaultOptions = {
      // 大小
      size: new Vector(70, 50),
      // 死亡
      isDead: false
    };

    // 合併自定義配置
    Object.assign(defaultOptions, options);
    // 配置配置到該物件內
    Object.assign(this, defaultOptions);
  }
}
