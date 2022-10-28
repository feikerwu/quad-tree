function getBound(bound: Bound) {
  return {
    x0: bound.x,
    y0: bound.y,
    x1: bound.x + bound.width,
    y1: bound.y + bound.height,
  };
}

export function collisionBetweenRects(A: Bound, B: Bound): boolean {
  const boundA = getBound(A),
    boundB = getBound(B);

  const collisionInX = boundA.x0 < boundB.x1 && boundA.x1 > boundB.x0;
  const collisionInY = boundA.y0 < boundB.y1 && boundA.y1 > boundB.y0;

  return collisionInX && collisionInY;
}
