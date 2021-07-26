import './index.less';

import { map } from 'lodash-es';
import React, { FC, useContext } from 'react';

import { MouseEventMethod } from '@/types';
import { transformStyle } from '@/utils';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import ContextMenu from './ContextMenu';
import Grid from './Grid';
import MarkLine from './MarkLine';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
}

const Editor: FC<EditorProps> = ({ prefixCls }) => {
  const { componentState } = useContext(ComponentDataContext);
  const { menuDispatch } = useContext(ContextMenuContext);

  const { componentData } = componentState;

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

  return (
    <div className={prefixCls} id="editor" onContextMenu={onContextMenu}>
      <Grid />

      {map(componentData, (component, index) => {
        return (
          <Shape
            key={component.id}
            index={index}
            originalComponent={component}
          />
        );
      })}

      <ContextMenu />

      <MarkLine />
    </div>
  );
};

Editor.defaultProps = {
  prefixCls: 'visual-drag-editor'
};

export default Editor;
