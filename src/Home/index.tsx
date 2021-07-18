import './index.less';

import React, { CSSProperties, FC, useReducer, useState } from 'react';

import { COMPONENT_LIST } from '@/core/data';
import { ComponentType, DragEventMethod } from '@/types';
import { cloneDeep, generateID } from '@/utils';

import BaseComponents from '../core/BaseComponents';
import ComponentDataContext from '../core/context/component-data';
import ContextMenuContext, {
  ContextMenuPosition
} from '../core/context/context-menu';
import Editor from '../core/Editor';
import Property from '../core/Property';
import componentReducer from '../core/reducer/component-data';
import Toolbar from '../core/Toolbar';

interface DemoProps {
  prefixCls?: string;
}

const Demo: FC<DemoProps> = ({ prefixCls }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({
    left: 0,
    top: 0
  });
  const [componentState, componentDispatch] = useReducer(componentReducer, {
    componentData: [],
    isClickComponent: false,
    snapshots: [],
    snapshotIndex: 0
  });

  const onDrop: DragEventMethod = e => {
    e.preventDefault();
    e.stopPropagation();
    const component = cloneDeep(
      COMPONENT_LIST[Number(e.dataTransfer.getData('index'))]
    );
    component.style.top = e.nativeEvent.offsetY;
    component.style.left = e.nativeEvent.offsetX;
    component.id = generateID();
    componentDispatch({
      type: 'setComponentData',
      payload: [...componentState.componentData, component]
    });
  };

  const onDragOver: DragEventMethod = e => {
    // 允许放置的条件
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onMouseUp: DragEventMethod = e => {
    if (!componentState.isClickComponent) {
      componentDispatch({ type: 'setCurComponent', payload: undefined });
    }

    if (e.button !== 2) {
      setVisible(false);
    }
  };

  return (
    <div className={prefixCls}>
      <ComponentDataContext.Provider
        value={{
          componentState,
          componentDispatch
        }}
      >
        <Toolbar />
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-content-left`}>
            <BaseComponents />
          </div>
          <div className={`${prefixCls}-content-wrapper`}>
            <div
              className={`${prefixCls}-content-wrapper-canvas`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onMouseUp={onMouseUp}
              onMouseDown={() =>
                componentDispatch({ type: 'setClick', payload: false })
              }
            >
              <ContextMenuContext.Provider
                value={{ visible, setVisible, position, setPosition }}
              >
                <Editor />
              </ContextMenuContext.Provider>
            </div>
          </div>
          <div className={`${prefixCls}-content-show`}>
            <Property />
          </div>
        </div>
      </ComponentDataContext.Provider>
    </div>
  );
};

Demo.defaultProps = {
  prefixCls: 'home'
};

export default Demo;
