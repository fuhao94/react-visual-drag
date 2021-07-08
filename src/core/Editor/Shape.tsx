import './index.less';

import React, { CSSProperties, FC, useContext } from 'react';

import { DragEventMethod, MouseEventMethod } from '@/types';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';

interface ShapeProps {
  prefixCls?: string;
  style: CSSProperties;
  defaultStyle: CSSProperties;
  index: number;
  setCurComponent: () => void;
}

const Shape: FC<ShapeProps> = ({
  style,
  index,
  defaultStyle,
  prefixCls,
  setCurComponent,
  children
}) => {
  const { onShapeMove } = useContext(ComponentDataContext);
  const { setVisible } = useContext(ContextMenuContext);

  const onMouseDown: DragEventMethod = e => {
    e.stopPropagation();
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

  return (
    <div
      className={prefixCls}
      style={style}
      onClick={onShapeClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
