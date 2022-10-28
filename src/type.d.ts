/**
 * 定义包围盒
 */
type Bound = {
  /**
   * (x, y) 为盒子左下角坐标
   */
  x: number;
  y: number;

  /**
   * width / height 为矩形盒子的大小
   */
  width: number;
  height: number;
};

type Shape = Bound & Record<string, any>;
