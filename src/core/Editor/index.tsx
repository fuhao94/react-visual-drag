import './index.less';

import { forEach, isNil, map, reduce } from 'lodash-es';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import Preview from '@/core/Editor/Preview';
import {
  ComponentType,
  DragEventMethod,
  MouseEventMethod,
  MouseEventWithStyleMethod
} from '@/types';
import { $ } from '@/utils';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import Area from './Area';
import ContextMenu from './ContextMenu';
import Grid from './Grid';
import MarkLine, { MarkLineRefProps } from './MarkLine';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
}

const Editor: FC<EditorProps> = ({ prefixCls }) => {
  const { componentState } = useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);

  const [showArea, setShowArea] = useState(false);

  // 吸附线实例
  const markLineRef = useRef<MarkLineRefProps>(null);
  // 画布的实例
  const editorRef = useRef($('#editor'));
  const editorPosRef = useRef({ editorX: 0, editorY: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const [area, setArea] = useState({ width: 0, height: 0 });
  const areaRef = useRef({ width: 0, height: 0 });

  const { componentData, canvasStyle } = componentState;

  /**
   * 右击事件处理器
   * @param e
   */
  const onContextMenu: MouseEventMethod = e => {
    e.stopPropagation();
    e.preventDefault();

    let target = e.target;
    let top = e.nativeEvent.offsetY;
    let left = e.nativeEvent.offsetX;

    // 右击的 target 是 SVG(背景图) 时候，target = <div class="visual-drag-editor" />
    while (target instanceof SVGElement) {
      target = target.parentNode;
    }

    // 选中自定义组件时候，left、top 需要加上组件的 x,y 坐标
    while (!target.className.includes('visual-drag-editor')) {
      left += target.offsetLeft;
      top += target.offsetTop;
      target = target.parentNode;
    }

    menuDispatch({ type: 'show' });
    menuDispatch({ type: 'setPosition', payload: { left, top } });
  };

  /**
   * 显示吸附线并标记坐标
   * @param e
   * @param style
   */
  const onShapeMove: MouseEventWithStyleMethod = (e, style) => {
    markLineRef.current?.showLine(style);
  };

  /**
   * 隐藏吸附线
   */
  const onShapeDestroyMove = () => {
    markLineRef.current?.hideLine();
  };

  /**
   * 获取选中区域
   * @return {ComponentType[]}
   */
  const getSelectedArea = () => {
    const { x, y } = startRef.current;
    const { width: aWidth, height: aHeight } = areaRef.current;

    return reduce(
      componentData,
      (result: ComponentType[], component) => {
        const left = Number(component.style.left);
        const top = Number(component.style.top);
        const width = Number(component.style.width);
        const height = Number(component.style.height);
        if (
          x <= left &&
          y <= top &&
          left + width <= x + aWidth &&
          top + height <= y + aHeight
        ) {
          result.push(component);
        }
        return result;
      },
      []
    );
  };

  const onCreateAreaGroup = async () => {
    const areaComponents = getSelectedArea();

    if (areaComponents.length <= 1) {
      setShowArea(false);
      return;
    }

    const { editorX, editorY } = editorPosRef.current;

    let top = Infinity;
    let left = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    forEach(areaComponents, component => {
      const style: Record<string, number> = {};
      const rect = $(`#component-${component.id}`)?.getBoundingClientRect();
      style.left = rect!.left - editorX;
      style.top = rect!.top - editorY;
      style.right = rect!.right - editorX;
      style.bottom = rect!.bottom - editorY;

      if (style.left < left) left = style.left;
      if (style.top < top) top = style.top;
      if (style.right > right) right = style.right;
      if (style.bottom > bottom) bottom = style.bottom;
    });

    startRef.current = { x: left, y: top };
    setArea({ width: right - left, height: bottom - top });
  };

  /**
   * 编辑器区域内"鼠标按下"的事件处理
   */
  const onEditorMouseDown: DragEventMethod = e => {
    // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
    e.preventDefault();

    // 初始化的一些操作
    // ---
    // 防止上一轮组合影响UI
    setShowArea(false);
    setArea({ width: 0, height: 0 });

    // 获取编辑器的信息(基于document)
    const rect = editorRef.current?.getBoundingClientRect();
    editorPosRef.current = {
      editorX: rect!.x,
      editorY: rect!.y
    };

    // 当前点位置(基于document)
    const startX = e.clientX;
    const startY = e.clientY;

    startRef.current = {
      x: startX - editorPosRef.current.editorX,
      y: startY - editorPosRef.current.editorY
    };

    // 开启选中区域
    setShowArea(true);

    const move = (moveEvent: any) => {
      setArea({
        width: Math.abs(moveEvent.clientX - startX),
        height: Math.abs(moveEvent.clientY - startY)
      });
      if (moveEvent.clientX < startX) {
        startRef.current.x = moveEvent.clientX - editorPosRef.current.editorX;
      }

      if (moveEvent.clientY < startY) {
        startRef.current.y = moveEvent.clientY - editorPosRef.current.editorY;
      }
    };

    const up = (e: any) => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);

      if (e.clientX === startX && e.clientY === startY) {
        setShowArea(false);
        setArea({ width: 0, height: 0 });
        return;
      }

      onCreateAreaGroup();
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  useEffect(() => {
    if (isNil(editorRef.current)) {
      editorRef.current = $('#editor');
    }
  }, [editorRef.current]);

  useEffect(() => {
    areaRef.current = area;
  }, [area]);

  return (
    <div
      className={prefixCls}
      style={canvasStyle}
      id="editor"
      onContextMenu={onContextMenu}
      onMouseDown={onEditorMouseDown}
    >
      <Grid />

      {map(componentData, (component, index) => {
        return (
          <Shape
            key={component.id}
            index={index}
            originalComponent={component}
            onMove={onShapeMove}
            onDestroyMove={onShapeDestroyMove}
          />
        );
      })}

      <ContextMenu />

      <MarkLine ref={markLineRef} />

      <Preview />

      {showArea && (
        <Area
          top={startRef.current.y}
          left={startRef.current.x}
          width={area.width}
          height={area.height}
        />
      )}
    </div>
  );
};

Editor.defaultProps = {
  prefixCls: 'visual-drag-editor'
};

export default Editor;
