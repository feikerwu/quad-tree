import { collisionBetweenRects } from './collision';

type QuadConfig = {
  maxLevels: number;
  capacity: number;
  bound: Bound;
};

class QuadTree {
  private shapes: Shape[] = [];
  /**
   * 最多4个子节点，分别为
   * 0 => rightTop
   * 1 => rightBottom
   * 2 => leftBottom
   * 3 => leftTop
   */
  private children: QuadTree[] = [];
  constructor(private config: QuadConfig, private level: number = 0) {}

  add(shape: Shape) {
    if (this.isLeaf()) {
      this.shapes.push(shape);
      if (this.shapes.length >= this.config.maxLevels) {
        this.split();
      }
      return;
    }

    const indexes = this.findIndexes(shape);
  }

  addAll(shapes: Shape[]) {}

  split() {}

  remove(shape: Shape) {}

  find(bound: Bound) {}

  clear() {}

  isLeaf() {
    return this.children.length === 0;
  }

  canAddShape() {
    return this.shapes.length < this.config.capacity;
  }

  findIndexes(shape: Shape) {
    // 这里的下标，可以直接换成子树
    const collisionChildrens = [];
    for (let child of collisionChildrens) {
      if (collisionBetweenRects(shape, this.config.bound)) {
        collisionChildrens.push(child);
      }
    }
    return collisionChildrens;
  }
}
