import GameObject from "./GameObject.js";

export default class Scene {
  constructor(options) {
    let defaultOptions = {
      // 場景內所有元素
      children: []
    };

    // 合併自定義配置
    Object.assign(defaultOptions, options);
    // 配置配置到該物件內
    Object.assign(this, defaultOptions);
  }

  addChild(obj) {
    if (obj instanceof GameObject) {
      this.children.push(obj);
    } else if (obj instanceof Array) {
      this.children = this.children.concat(obj);
    } else {
      console.error("Object is not a GameObject");
    }
  }

  removeChild(target) {
    this.children = this.children.filter((child) => child !== target);
  }

  getChildByName(name) {
    return this.children.find((child) => child.name === name);
  }

  getChildByTag(tag) {
    return this.children.filter((child) =>
      child.tags.find((childTag) => childTag === tag)
    );
  }

  update() {
    this.children.forEach((child) => child.update());
  }

  draw() {
    this.children.forEach((child) => child.draw());
  }
}
