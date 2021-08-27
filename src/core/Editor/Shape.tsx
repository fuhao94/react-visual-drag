import './index.less';

import { RedoOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { debounce, isEmpty, isEqual, isNil, map, merge } from 'lodash-es';
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
 * 根据组件类型，生成画布上的组件
 * @param component {ComponentType}
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
  // 上一次吸附的样式
  const preDragShiftStyle = usePrevious(dragShiftStyle);
  // 每个组件独立处理自己的配置，防止频繁刷新引起的卡顿
  const [component, setComponent] = useState<ComponentType>(originalComponent);

  // 画布的实例
  const editorRef = useRef($('#editor'));

  /**
   * 更新 store 的组件样式
   */
  const onSyncData = debounce((style: CSSProperties) => {
    componentDispatch({
      type: 'setComponentStyle',
      payload: { style, index }
    });
  }, 100);

  /**
   * 样式更改
   * @param style
   */
  const onChangeShapeStyle = (style: CSSProperties) => {
    setComponent({ ...component, style });
    onSyncData(style);
  };

  /**
   * 组件按下鼠标事件处理器(开始拖拽)
   * @param e
   */
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

  /**
   * 点击事件处理器
   * @param e
   */
  const onShapeClick: MouseEventMethod = e => {
    // 阻止向父组件冒泡
    e.stopPropagation();
    e.preventDefault();
    // 关闭右键菜单
    menuDispatch({ type: 'hide' });
  };

  /**
   * 8个点按下鼠标事件处理器
   * @param point
   * @param downEvent
   */
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

  /**
   * 按下旋转按钮处理器
   * 核心在 Math.atan2 方法，返回一个旋转的弧度
   * @param e
   */
  const onRotateMouseDown: DragEventMethod = e => {
    componentDispatch({ type: 'setClick', payload: true });
    e.preventDefault();
    e.stopPropagation();

    // 初始坐标和初始角度
    const pos = { ...component.style } as any;
    const startY = e.clientY;
    const startX = e.clientX;
    const startRotate = pos.rotate;
    console.log(startX, startY, startRotate);

    // 获取元素中心点位置
    const rect = editorRef.current?.getBoundingClientRect();
    const centerX = rect!.left + rect!.width / 2;
    const centerY = rect!.top + rect!.height / 2;

    // 旋转前的角度
    const rotateDegreeBefore =
      Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

    const move = (moveEvent: any) => {
      const curX = moveEvent.clientX;
      const curY = moveEvent.clientY;
      console.log(Math.atan2(curY - centerY, curX - centerX));
      // 旋转后的角度
      const rotateDegreeAfter =
        Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180);

      // 获取旋转的角度值
      pos.rotate = Number(startRotate) + rotateDegreeAfter - rotateDegreeBefore;
      onChangeShapeStyle(pos);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  /**
   * 组件 active 状态下标记8个点
   * @return {ReactNode}
   */
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

    if (isNil(editorRef.current)) {
      editorRef.current = $('#editor');
    }
  }, [componentData]);

  return (
    <div
      className={prefixCls}
      style={transformStyle(component.style)}
      onClick={onShapeClick}
      onMouseDown={onShapeMouseDown}
    >
      {curComponentId === component.id && (
        <>
          <RedoOutlined
            className={`${prefixCls}-rotate`}
            onMouseDown={onRotateMouseDown}
          />
          {shapePointEl()}
        </>
      )}
      {generateComponent(component)}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
