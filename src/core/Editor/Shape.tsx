import './index.less';

import { Button, Input } from 'antd';
import { debounce, map } from 'lodash-es';
import React, {
  CSSProperties,
  FC,
  ImgHTMLAttributes,
  useContext,
  useRef,
  useState
} from 'react';

import {
  ComponentType,
  DragEventMethod,
  MouseEventMethod,
  PointPosType
} from '@/types';
import { $, getComponentStyle, getPointStyle, transformStyle } from '@/utils';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';

/**
 * 加载相应组件
 * @param component
 */
function generateComponent(component: ComponentType) {
  const props = {
    ...component.props,
    style: getComponentStyle(component.style)
  };
  switch (component.name) {
    case 'r-button':
      return <Button {...props}>{component.label}</Button>;
    case 'r-input':
      return <Input {...props} />;
    case 'r-img': {
      return (
        <img
          draggable="false"
          {...(props as ImgHTMLAttributes<HTMLImageElement>)}
          alt={component.label}
        />
      );
    }
  }
}

// 8个光标点
const SHAPE_POINTS: PointPosType[] = [
  'lt',
  't',
  'rt',
  'r',
  'rb',
  'b',
  'lb',
  'l'
];

interface ShapeProps {
  prefixCls?: string;
  index: number;
  originalComponent: ComponentType;
}

const Shape: FC<ShapeProps> = ({ index, prefixCls, originalComponent }) => {
  const { componentState, componentDispatch } =
    useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);
  const { curComponentId } = componentState;

  const [component, setComponent] = useState<ComponentType>(originalComponent);

  // 画布的实例
  const editorRef = useRef($('#editor'));

  const onSyncData = debounce((pos: CSSProperties) => {
    componentDispatch({
      type: 'setComponentStyle',
      payload: { style: pos, index }
    });
  }, 100);

  const onShapeMouseDown: DragEventMethod = e => {
    e.stopPropagation();
    componentDispatch({ type: 'setClick', payload: true });
    componentDispatch({ type: 'setCurComponentId', payload: component.id });
    const pos = { ...component.style };
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

      setComponent({ ...component, style: pos });
      onSyncData(pos);
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
    menuDispatch({ type: 'hide' });
  };

  const handleMouseDownOnPoint = (point: PointPosType, downEvent: any) => {
    downEvent.stopPropagation();
    downEvent.preventDefault();

    const pos = { ...component.style };
    const height = Number(pos.height);
    const width = Number(pos.width);
    const top = Number(pos.top);
    const left = Number(pos.left);
    const startX = downEvent.clientX;
    const startY = downEvent.clientY;

    const move = (moveEvent: any) => {
      const currX = moveEvent.clientX;
      const currY = moveEvent.clientY;
      const disY = currY - startY;
      const disX = currX - startX;
      const hasT = /t/.test(point);
      const hasB = /b/.test(point);
      const hasL = /l/.test(point);
      const hasR = /r/.test(point);
      const newHeight = height + (hasT ? -disY : hasB ? disY : 0);
      const newWidth = width + (hasL ? -disX : hasR ? disX : 0);
      pos.height = newHeight > 0 ? newHeight : 0;
      pos.width = newWidth > 0 ? newWidth : 0;
      pos.left = left + (hasL ? disX : 0);
      pos.top = top + (hasT ? disY : 0);

      setComponent({ ...component, style: pos });
      onSyncData(pos);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const shapePointEl = () => {
    const width = component.style.width as number;
    const height = component.style.height as number;
    return map(SHAPE_POINTS, point => {
      return (
        <div
          className={`${prefixCls}-point`}
          style={getPointStyle(point, { width, height })}
          key={point}
          onMouseDown={e => handleMouseDownOnPoint(point, e)}
        />
      );
    });
  };

  return (
    <div
      className={prefixCls}
      style={transformStyle(component.style)}
      onClick={onShapeClick}
      onMouseDown={onShapeMouseDown}
    >
      {curComponentId === component.id && shapePointEl()}
      {generateComponent(component)}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
