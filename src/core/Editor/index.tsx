import './index.less';

import { map } from 'lodash-es';
import React, { FC, useContext, useRef } from 'react';

import Preview from '@/core/Editor/Preview';
import { MouseEventMethod, MouseEventWithStyleMethod } from '@/types';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import ContextMenu from './ContextMenu';
import Grid from './Grid';
import MarkLine, { MarkLineRefProps } from './MarkLine';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
}

const Editor: FC<EditorProps> = ({ prefixCls }) => {
  const { componentState, componentDispatch } =
    useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);
  const markLineRef = useRef<MarkLineRefProps>(null);

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

  return (
    <div
      className={prefixCls}
      style={canvasStyle}
      id="editor"
      onContextMenu={onContextMenu}
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
    </div>
  );
};

Editor.defaultProps = {
  prefixCls: 'visual-drag-editor'
};

export default Editor;
