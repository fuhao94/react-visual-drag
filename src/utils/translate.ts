/**
 * 角度转弧度（Math.PI = 180 度）
 * @param angle 角度
 */
function angleToRadian(angle: number) {
  return (angle * Math.PI) / 180;
}

export function sin(rotate: number) {
  return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function cos(rotate: number) {
  return Math.abs(Math.cos(angleToRadian(rotate)));
}
