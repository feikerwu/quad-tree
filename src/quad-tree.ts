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
    if (!this.isLeaf()) {
      const collisionChildrens = this.findCollisionChildrens(shape);
      collisionChildrens.forEach(child => child.add(shape));
      return;
    }
    // 叶子节点
    this.shapes.push(shape);
    // 如果当前页面的图元数量大于上限
    // 这里有可能因为某个图元的大小完全覆盖了某个儿子，导致不需要不断的对子节点进行分割，从而出现问题
    // 需要对最深层级判断，避免死循环
    if (
      this.shapes.length > this.config.capacity &&
      this.config.maxLevels > this.level
    ) {
      this.split();

      for (let curShape of this.shapes) {
        let curCollisionChildrens = this.findCollisionChildrens(curShape);
        curCollisionChildrens.forEach(child => child.add(curShape));
      }

      // 清空当前节点所有存储的节点
      this.shapes = [];
    }
  }

  addAll(shapes: Shape[]) {
    shapes.forEach(shape => this.add(shape));
  }

  split() {
    splitCalled++;
    const { x, y, width, height } = this.config.bound;
    const halfWidth = width / 2,
      halfHeight = height / 2;

    // 将当前节点分为4块，以当前节点的矩形中心为坐标原点，第一象限为0
    const childrenBounds = [
      { x: x + halfWidth, y: y + halfHeight },
      { x: x, y: y + halfHeight },
      { x, y },
      { x: x + halfWidth, y: y },
    ];

    this.children = [];

    childrenBounds.forEach(({ x: curX, y: curY }) => {
      this.children.push(
        new QuadTree(
          {
            bound: { x: curX, y: curY, width: halfWidth, height: halfHeight },
            maxLevels: this.config.maxLevels,
            capacity: this.config.capacity,
          },
          this.level + 1
        )
      );
    });
  }

  remove(shape: Shape) {}

  find(bound: Bound) {}

  clear() {}

  isLeaf() {
    return this.children.length === 0;
  }

  canAddShape() {
    return this.shapes.length < this.config.capacity;
  }

  // 找到和给定图元有冲突的子树
  findCollisionChildrens(shape: Shape) {
    const collisionChildrens: QuadTree[] = [];
    for (let child of this.children) {
      if (collisionBetweenRects(shape, child.config.bound)) {
        collisionChildrens.push(child);
      }
    }

    return collisionChildrens;
  }
}

export default QuadTree;
