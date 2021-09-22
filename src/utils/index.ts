import { CSSProperties } from 'react';

import { cos, sin } from './translate';

let id = 1;

export function generateID() {
  return id++;
}

export function $(selector: string) {
  return document.querySelector(selector);
}

/**
 * 给样式添加单位
 * @param style
 */
export const transformStyle = (style: CSSProperties) =>
  ['width', 'height', 'top', 'left', 'rotate'].reduce(
    (prev: CSSProperties, attr) => {
      if (attr !== 'rotate') {
        return {
          ...prev,
          [attr]: (style[attr as keyof CSSProperties] || 0) + 'px'
        };
      } else {
        return {
          ...prev,
          transform: 'rotate(' + (style[attr] || 0) + 'deg)'
        };
      }
    },
    {}
  );

/**
 * 生成组件样式
 * @param style
 * @param filter
 */
export function getStyle(style: CSSProperties, filter: string[] = []) {
  const needUnit = [
    'fontSize',
    'width',
    'height',
    'top',
    'left',
    'borderWidth',
    'letterSpacing',
    'borderRadius',
    'backgroundImage'
  ];
  return Object.keys(style).reduce((result: any, key) => {
    if (!filter.includes(key)) {
      if (needUnit.includes(key)) {
        result[key] = style[key as keyof CSSProperties] + 'px';
      }
    }
    return result;
  }, {});
}

/**
 * 过滤组件样式
 * @param style
 */
export function getComponentStyle(style: CSSProperties) {
  return getStyle(style, ['top', 'left', 'rotate']);
}

/**
 * 获取 `点` 的位置
 * @param point
 * @param style
 */
export function getPointStyle(
  point: string,
  style: { width: number; height: number }
) {
  const { width, height } = style;
  const hasT = /t/.test(point);
  const hasB = /b/.test(point);
  const hasL = /l/.test(point);
  const hasR = /r/.test(point);
  let newLeft = 0;
  let newTop = 0;

  // 四个角的点
  if (point.length === 2) {
    newLeft = hasL ? 0 : width;
    newTop = hasT ? 0 : height;
  } else {
    // 上下两点的点，宽度居中
    if (hasT || hasB) {
      newLeft = width / 2;
      newTop = hasT ? 0 : height;
    }

    // 左右两边的点，高度居中
    if (hasL || hasR) {
      newLeft = hasL ? 0 : width;
      newTop = Math.floor(height / 2);
    }
  }

  return {
    marginLeft: hasR ? '-4px' : '-4px',
    marginTop: '-4px',
    left: `${newLeft}px`,
    top: `${newTop}px`
  };
}

/**
 * 欺骗 TS 生成 Int 类型样式值
 * @param style
 */
export function fakeTsIntStyle(style: CSSProperties) {
  return ['width', 'height', 'left', 'top'].reduce(
    (result: Record<string, number>, key) => {
      Object.assign(result, {
        [key]: style[key as keyof CSSProperties] as number
      });
      return result;
    },
    {}
  );
}

/**
 * 获取一个组件旋转 rotate 后的样式
 * @param pos
 */
export function getComponentRotatedStyle(pos: CSSProperties) {
  const style = { ...pos };

  const width = Number(style.width);
  const height = Number(style.height);
  const left = Number(style.left);
  const top = Number(style.top);
  const rotate = Number(style.rotate);

  if (Number(style.rotate) !== 0) {
    const newWidth = width * cos(rotate) + height * sin(rotate);
    // 旋转后范围变小是正值，变大是负值
    const diffX = (width - newWidth) / 2;
    style.left = diffX + left;
    style.right = left + newWidth;

    const newHeight = height * cos(rotate) + width * sin(rotate);
    // 始终是正
    const diffY = (newHeight - height) / 2;
    style.top = top - diffY;
    style.bottom = top + newHeight;

    style.width = newWidth;
    style.height = newHeight;
  } else {
    style.bottom = top + height;
    style.right = left + width;
  }

  return style;
}
