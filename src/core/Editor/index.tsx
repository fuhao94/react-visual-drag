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
  const { componentState } = useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);
  const markLineRef = useRef<MarkLineRefProps>(null);

  const { componentData, canvasStyle } = componentState;

  const onContextMenu: MouseEventMethod = e => {
    e.stopPropagation();
    e.preventDefault();

    let target = e.target;
    let top = e.nativeEvent.offsetY;
    let left = e.nativeEvent.offsetX;

    while (target instanceof SVGElement) {
      target = target.parentNode;
    }
    while (!target.className.includes('visual-drag-editor')) {
      left += target.offsetLeft;
      top += target.offsetTop;
      target = target.parentNode;
    }
    menuDispatch({ type: 'show' });
    menuDispatch({ type: 'setPosition', payload: { left, top } });
  };

  const onShapeMove: MouseEventWithStyleMethod = (e, style) => {
    markLineRef.current?.showLine(style);
  };
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
