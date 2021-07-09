import './index.less';

import { Button, Input } from 'antd';
import React, { CSSProperties, FC, useContext, useRef } from 'react';

import { ComponentType, MouseEventMethod } from '@/types';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';
import { getStyle, transformStyle } from '../utils';
import ContextMenu from './ContextMenu';
import Grid from './Grid';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
  dataSource: ComponentType[];
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
  const style = getComponentStyle(component.style);
  switch (component.name) {
    case 'r-button':
      return (
        <Button {...component.props} style={style}>
          {component.label}
        </Button>
      );
    case 'r-input':
      return <Input {...component.props} style={style} />;
  }
}

const Editor: FC<EditorProps> = ({ dataSource, prefixCls }) => {
  const { setCurComponent } = useContext(ComponentDataContext);
  const { setVisible, setPosition } = useContext(ContextMenuContext);

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
    setVisible(true);
    setPosition({ left, top });
  };

  return (
    <div className={prefixCls} id="editor" onContextMenu={onContextMenu}>
      <Grid />

      {dataSource.map((component, index) => {
        return (
          <Shape
            key={component.id}
            index={index}
            defaultStyle={component.style}
            style={transformStyle(component.style)}
            setCurComponent={() => setCurComponent?.(component)}
          >
            {generateComponent(component)}
          </Shape>
        );
      })}

      {/* 右键菜单 */}
      <ContextMenu />
    </div>
  );
};

Editor.defaultProps = {
  prefixCls: 'visual-drag-editor'
};

export default Editor;
