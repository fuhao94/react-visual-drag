import './index.less';

import React, { CSSProperties, FC } from 'react';

import { ComponentType, DragEventMethod } from '@/types';

interface ShapeProps {
  prefixCls?: string;
  component: ComponentType;
  style: CSSProperties;
  defaultStyle: CSSProperties;
  setData: (data: ComponentType) => void;
}

const Shape: FC<ShapeProps> = ({
  style,
  defaultStyle,
  prefixCls,
  component,
  setData,
  children
}) => {
  const onShapeMouseDown: DragEventMethod = e => {
    e.stopPropagation();
    const pos = { ...defaultStyle };
    // 拖拽起点的 xy 坐标
    const startY = e.clientY;
    const startX = e.clientX;
    // 组件开始 xy 坐标
    const startTop = Number(pos.top);
    const startLeft = Number(pos.left);

    const move = (moveEvent: any) => {
      const currX = moveEvent.clientX;
      const currY = moveEvent.clientY;
      // 当前最新的 xy 坐标减去最开始的 xy 坐标，加上起始位置 xy 坐标
      pos.top = currY - startY + startTop;
      pos.left = currX - startX + startLeft;
      // componentDispatch({
      //   type: 'setComponentStyle',
      //   payload: { style: pos, index }
      // });
      setData({ ...component, style: pos });
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  return (
    <div className={prefixCls} style={style} onMouseDown={onShapeMouseDown}>
      {children}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
