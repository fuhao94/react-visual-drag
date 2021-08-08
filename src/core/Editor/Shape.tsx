import './index.less';

import { Button, Input } from 'antd';
import { debounce, findIndex, isEmpty, isEqual, map, merge } from 'lodash-es';
import React, {
  CSSProperties,
  FC,
  ImgHTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { usePrevious } from '@/hooks/use-previous';
import {
  ComponentType,
  DragEventMethod,
  MouseEventMethod,
  MouseEventWithStyleMethod,
  PointPosType
} from '@/types';
import { $, getComponentStyle, getPointStyle, transformStyle } from '@/utils';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';

/**
 * 加载相应组件
 * @param component
 */
export function generateComponent(component: ComponentType) {
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
  onMove: MouseEventWithStyleMethod;
  onDestroyMove: () => void;
}

const Shape: FC<ShapeProps> = ({
  index,
  prefixCls,
  originalComponent,
  onMove,
  onDestroyMove
}) => {
  const { componentState, curComponentIndex, componentDispatch } =
    useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);
  const { curComponentId, dragShiftStyle, componentData } = componentState;

  const preDragShiftStyle = usePrevious(dragShiftStyle);

  const [component, setComponent] = useState<ComponentType>(originalComponent);

  // 画布的实例
  const editorRef = useRef($('#editor'));

  const onSyncData = debounce((style: CSSProperties) => {
    componentDispatch({
      type: 'setComponentStyle',
      payload: { style, index }
    });
  }, 100);

  const onChangeShapeStyle = (style: CSSProperties) => {
    setComponent({ ...component, style });
    onSyncData(style);
  };

  const onShapeMouseDown: DragEventMethod = e => {
    e.stopPropagation();

    componentDispatch({ type: 'setClick', payload: true });
    componentDispatch({
      type: 'setCurComponent',
      payload: { id: component.id }
    });

    const style = { ...component.style };
    // 拖拽起点的 xy 坐标
    const startY = e.clientY;
    const startX = e.clientX;
    // 组件开始 xy 坐标
    const startTop = Number(style.top);
    const startLeft = Number(style.left);

    const move = (moveEvent: any) => {
      const currX = moveEvent.clientX;
      const currY = moveEvent.clientY;
      // 当前最新的 xy 坐标减去最开始的 xy 坐标，加上起始位置 xy 坐标
      style.top = currY - startY + startTop;
      style.left = currX - startX + startLeft;

      onChangeShapeStyle(style);
      // 配合吸附线-显示
      onMove(e, style);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);

      // 配合吸附线-销毁
      onDestroyMove();
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

  const onPointMouseDown = (point: PointPosType, downEvent: any) => {
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

      onChangeShapeStyle(pos);
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
          onMouseDown={e => onPointMouseDown(point, e)}
        />
      );
    });
  };

  /**
   * 吸附事件处理器
   */
  useEffect(() => {
    if (
      component.id === curComponentId &&
      !isEmpty(dragShiftStyle) &&
      !isEqual(dragShiftStyle, preDragShiftStyle)
    ) {
      const style = merge(component.style, dragShiftStyle);
      onChangeShapeStyle(style);
      // 吸附完成进行重置操作
      componentDispatch({ type: 'setCurComponentDragShift', payload: {} });
    }
  }, [dragShiftStyle]);

  useEffect(() => {
    if (
      curComponentId === component.id &&
      !isEmpty(componentData) &&
      curComponentIndex > -1
    ) {
      setComponent(componentData[curComponentIndex]);
    }
  }, [componentData]);

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
