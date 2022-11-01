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
    // 不冲突，进不了当前树
    if (!collisionBetweenRects(shape, this.config.bound)) {
      return;
    }
    if (this.isLeaf()) {
      if (this.shapes.length >= this.config.maxLevels) {
        this.split();
        const shapesNeedAdded = [...this.shapes, shape];
        this.children.forEach(child => child.addAll(shapesNeedAdded));
        // this.addAll(shapesNeedAdded);
        this.shapes = [];
      } else {
        this.shapes.push(shape);
      }
    }

    const children = this.findCollisionChildrens(shape);
    for (let child of children) {
      child.add(shape);
    }
  }

  addAll(shapes: Shape[]) {
    shapes.forEach(shape => this.add(shape));
  }

  split() {
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
    for (let child of collisionChildrens) {
      if (collisionBetweenRects(shape, this.config.bound)) {
        collisionChildrens.push(child);
      }
    }
    return collisionChildrens;
  }
}

let shapes = [
  { x: 0, y: 0, width: 200, height: 200 },
  { x: 0, y: 0, width: 100, height: 100 },
  { x: 20, y: 20, width: 50, height: 50 },
];

const count = 100,
  width = 1000,
  height = 1000;
for (let i = 0; i < count; i++) {
  let x = Math.random() * width,
    y = Math.random() * height,
    curWidth = Math.random() * (width - x),
    curHeight = Math.random() * (height - y);
  shapes.push({
    x,
    y,
    width: curWidth,
    height: curHeight,
  });
}

let q = new QuadTree(
  {
    bound: { x: 0, y: 0, width, height },
    maxLevels: 10,
    capacity: 2,
  },
  0
);

function run() {
  shapes.forEach(shape => q.add(shape));
  console.log(shapes);
  console.log(q);
}

run();
