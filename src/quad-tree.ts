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

let shapes: Bound[] = [];

const count = 10,
  width = 1000,
  height = 1000;
// for (let i = 0; i < count; i++) {
//   let x = Math.random() * width,
//     y = Math.random() * height,
//     curWidth = Math.random() * (width - x),
//     curHeight = Math.random() * (height - y);
//   shapes.push({
//     x,
//     y,
//     width: curWidth,
//     height: curHeight,
//   });
// }

let q = new QuadTree(
  {
    bound: { x: 0, y: 0, width, height },
    maxLevels: 10,
    capacity: 2,
  },
  0
);

shapes = [
  {
    x: 610.3133873994766,
    y: 821.2643595503779,
    width: 374.92761530087574,
    height: 175.91455512278654,
  },
  {
    x: 555.2000420173695,
    y: 245.7119576625706,
    width: 304.8103323784652,
    height: 726.2463870322822,
  },
  {
    x: 933.4560296910663,
    y: 83.58228854342364,
    width: 44.38487406018081,
    height: 189.18290274673694,
  },
  {
    x: 12.589766237862898,
    y: 910.2657879251863,
    width: 288.12345916857845,
    height: 47.34497438727149,
  },
  {
    x: 153.38396043596103,
    y: 614.6476553046493,
    width: 16.602054103424752,
    height: 11.653060352214528,
  },
  {
    x: 16.496780564545066,
    y: 931.3940917695273,
    width: 156.0769982718933,
    height: 45.34036408268666,
  },
  {
    x: 700.9250162521838,
    y: 150.6029650585232,
    width: 250.77200136775335,
    height: 85.2273831984594,
  },
  {
    x: 373.64394249726683,
    y: 886.4670567696227,
    width: 602.2604419563726,
    height: 84.21947146976966,
  },
  {
    x: 3.203307773337327,
    y: 238.56526619813923,
    width: 140.07722921488784,
    height: 168.5443742570285,
  },
  {
    x: 832.8335054237804,
    y: 169.68199933549943,
    width: 62.17548294850965,
    height: 616.9083634575924,
  },
];
function run() {
  shapes.forEach(shape => q.add(shape));
  console.log(shapes);
  console.log(q);
}

try {
  run();
  console.log('split called', splitCalled);
} catch (e) {
  console.log(e);
  // console.log(shapes);
}
