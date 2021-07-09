import './index.less';

import React, { CSSProperties, FC, useContext } from 'react';

import { DragEventMethod, MouseEventMethod } from '@/types';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import { getPointStyle } from '../utils';

interface ShapeProps {
  prefixCls?: string;
  style: CSSProperties;
  defaultStyle: CSSProperties;
  index: number;
  setCurComponent: () => void;
}

// 8个光标点
const SHAPE_POINTS = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'];

const Shape: FC<ShapeProps> = ({
  style,
  index,
  defaultStyle,
  prefixCls,
  setCurComponent,
  children
}) => {
  const { onShapeMove, setIsClickComponent } = useContext(ComponentDataContext);
  const { setVisible } = useContext(ContextMenuContext);

  const onMouseDown: DragEventMethod = e => {
    e.stopPropagation();
    setIsClickComponent(true);
    setCurComponent();

    const pos = { ...defaultStyle };
    const startY = e.clientY;
    const startX = e.clientX;

    const startTop = Number(pos.top);
    const startLeft = Number(pos.left);

    const move = (moveEvent: any) => {
      const currX = moveEvent.clientX;
      const currY = moveEvent.clientY;
      pos.top = currY - startY + startTop;
      pos.left = currX - startX + startLeft;
      onShapeMove?.(pos, index);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const onShapeClick: MouseEventMethod = e => {
    // 阻止向父组件冒泡
    e.stopPropagation();
    e.preventDefault();
    // 关闭右键菜单
    setVisible(false);
  };

  const shapePointEl = () => {
    const width = defaultStyle.width as number;
    const height = defaultStyle.height as number;
    return SHAPE_POINTS.map(point => {
      return (
        <div
          className={`${prefixCls}-point`}
          style={getPointStyle(point, { width, height })}
          key={point}
          onMouseDown={() => setIsClickComponent(true)}
        />
      );
    });
  };

  return (
    <div
      className={prefixCls}
      style={style}
      onClick={onShapeClick}
      onMouseDown={onMouseDown}
    >
      {shapePointEl()}
      {children}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
