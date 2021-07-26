import './index.less';

import { Button, Input } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { CSSProperties, FC, ImgHTMLAttributes } from 'react';

import { ComponentType } from '@/types';
import { getStyle, transformStyle } from '@/utils';

import Grid from './Grid';
import Shape from './Shape';

interface EditorProps {
  prefixCls?: string;
  data: ComponentType;
  setData: (data: ComponentType) => void;
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

const Editor: FC<EditorProps> = ({ prefixCls, data, setData }) => {
  return (
    <div className={prefixCls} id="editor">
      <Grid />
      <Shape
        defaultStyle={data.style}
        style={transformStyle(data.style)}
        component={data}
        setData={setData}
      >
        {!isEmpty(data) && generateComponent(data)}
      </Shape>
    </div>
  );
};

Editor.defaultProps = {
  prefixCls: 'visual-drag-editor'
};

export default Editor;
