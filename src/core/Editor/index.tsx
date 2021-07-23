import './index.less';

import { Button, Input } from 'antd';
import { map } from 'lodash-es';
import React, { CSSProperties, FC, ImgHTMLAttributes, useContext } from 'react';

import { ComponentType, MouseEventMethod } from '@/types';
import { getStyle, transformStyle } from '@/utils';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import ContextMenu from './ContextMenu';
import Grid from './Grid';
import MarkLine from './MarkLine';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
}

/**
 * 过滤组件样式
 * @param style
 */
function getComponentStyle(style: CSSProperties) {
  return getStyle(style, ['top', 'left', 'rotate']);
}

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
            defaultStyle={component.style}
            style={transformStyle(component.style)}
            component={component}
          >
            {generateComponent(component)}
          </Shape>
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
