import './index.less';

import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useContext,
  useRef
} from 'react';

import {
  ComponentType,
  DragEventMethod,
  MouseEventMethod,
  PointPosType
} from '@/types';
import { $, fakeTsIntStyle, getPointStyle } from '@/utils';
import calculateComponentPositionAndSize from '@/utils/calculateComponentPositonAndSize';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';

interface ShapeProps {
  prefixCls?: string;
  index: number;
  component: ComponentType;
  style: CSSProperties;
  defaultStyle: CSSProperties;
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

const Shape: FC<ShapeProps> = ({
  style,
  index,
  defaultStyle,
  prefixCls,
  component,
  children
}) => {
  const { componentState, componentDispatch } =
    useContext(ComponentDataContext);
  const { setVisible } = useContext(ContextMenuContext);
  const { curComponent } = componentState;

  // 画布的实例
  const editorRef = useRef($('#editor'));

  const onShapeMouseDown: DragEventMethod = e => {
    e.stopPropagation();
    componentDispatch({ type: 'setClick', payload: true });
    componentDispatch({ type: 'setCurComponent', payload: component });

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
      componentDispatch({
        type: 'setComponentStyle',
        payload: { style: pos, index }
      });
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

  const onPointMouseDown = (
    point: PointPosType,
    e: MouseEvent<HTMLDivElement>
  ) => {
    componentDispatch({ type: 'setClick', payload: true });

    e.stopPropagation();
    e.preventDefault();

    const style = { ...defaultStyle };
    const { width, height, top, left } = fakeTsIntStyle(style);

    // 组件宽高比
    const proportion = width / height;

    // 组件中心点
    const center = {
      x: left + width / 2,
      y: top + height / 2
    };

    const editorRectInfo = editorRef.current?.getBoundingClientRect();

    // 当前点击坐标
    const curPoint = {
      x: e.clientX - (editorRectInfo?.left as number),
      y: e.clientY - (editorRectInfo?.top as number)
    };

    // 获取对称点的坐标
    const symmetricPoint = {
      x: center.x - (curPoint.x - center.x),
      y: center.y - (curPoint.y - center.y)
    };

    let isFirst = true;

    const move = (moveEvent: any) => {
      // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
      // 因此第一次点击时不触发 move 事件
      if (isFirst) {
        isFirst = false;
        return;
      }
      const curPosition = {
        x: moveEvent.clientX - (editorRectInfo?.left as number),
        y: moveEvent.clientY - (editorRectInfo?.top as number)
      };
      calculateComponentPositionAndSize(
        point,
        style,
        curPosition,
        proportion,
        false,
        {
          center,
          curPoint,
          symmetricPoint
        }
      );
      componentDispatch({
        type: 'setComponentStyle',
        payload: { style, index }
      });
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const handleMouseDownOnPoint = (point: PointPosType, downEvent: any) => {
    downEvent.stopPropagation();
    downEvent.preventDefault();

    const pos = { ...defaultStyle };
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
      componentDispatch({
        type: 'setComponentStyle',
        payload: { style: pos, index }
      });
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
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
          onMouseDown={e => handleMouseDownOnPoint(point, e)}
        />
      );
    });
  };

  return (
    <div
      className={prefixCls}
      style={style}
      onClick={onShapeClick}
      onMouseDown={onShapeMouseDown}
    >
      {curComponent === component && shapePointEl()}
      {children}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
