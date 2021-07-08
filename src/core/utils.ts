import { CSSProperties } from 'react';

let id = 0;

export function generateID() {
  return id++;
}

export function cloneDeep(obj: any, map = new Map()) {
  if (typeof obj === 'object' && obj !== null) {
    let res: any = Array.isArray(obj) ? [] : {};
    const symbols = Object.getOwnPropertySymbols(obj);
    if (symbols.length > 0) {
      symbols.forEach(sym => {
        res[sym] = obj[sym];
      });
    }
    if (map.get(obj)) {
      return map.get(obj);
    }
    Object.keys(obj).forEach(key => {
      res[key] = cloneDeep(obj[key], map);
    });
    map.set(obj, res);
    return res;
  } else {
    return obj;
  }
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
    'borderRadius'
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
