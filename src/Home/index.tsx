import './index.less';

import { cloneDeep } from 'lodash-es';
import React, { FC, useReducer } from 'react';

import { COMPONENT_LIST } from '@/core/data';
import { DragEventMethod } from '@/types';
import { generateID } from '@/utils';

import BaseComponents from '../core/BaseComponents';
import ComponentDataContext from '../core/context/component-data';
import ContextMenuContext from '../core/context/context-menu';
import Editor from '../core/Editor';
import Property from '../core/Property';
import componentReducer from '../core/reducer/component-data';
import contextReducer from '../core/reducer/context-menu';
import Toolbar from '../core/Toolbar';

interface HomeProps {
  prefixCls?: string;
}

const Demo: FC<HomeProps> = ({ prefixCls }) => {
  const [componentState, componentDispatch] = useReducer(componentReducer, {
    componentData: [
      {
        id: 0,
        name: 'r-img',
        label: '图片',
        props: { src: '/static/media/cat.659487d6.jpeg' },
        style: {
          width: 114,
          height: 200,
          rotate: 0,
          opacity: 1,
          top: 20,
          left: 100
        }
      },
      {
        id: 1,
        name: 'r-button',
        label: '按钮',
        props: {},
        style: {
          width: 100,
          height: 32,
          rotate: 0,
          opacity: 1,
          top: 40,
          left: 230
        }
      }
    ],
    isClickComponent: false,
    snapshots: [],
    snapshotIndex: -1,
    curComponentId: -1
  });
  const [menuState, menuDispatch] = useReducer(contextReducer, {
    visible: false,
    position: { left: 0, top: 0 }
  });
  const { componentData, isClickComponent } = componentState;

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
      payload: [...componentData, component]
    });
  };

  const onDragOver: DragEventMethod = e => {
    // 允许放置的条件
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onMouseUp: DragEventMethod = e => {
    if (!isClickComponent) {
      // FIXME 需要先执行右键操作再取消选择组件 被迫来个异步操作
      setTimeout(() => {
        componentDispatch({
          type: 'setCurComponent',
          payload: { id: -1 }
        });
      }, 0);
    }
    if (e.button !== 2) {
      menuDispatch({ type: 'hide' });
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
        <ContextMenuContext.Provider value={{ menuState, menuDispatch }}>
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
                <Editor />
              </div>
            </div>
            <div className={`${prefixCls}-content-show`}>
              <Property />
            </div>
          </div>
        </ContextMenuContext.Provider>
      </ComponentDataContext.Provider>
    </div>
  );
};

Demo.defaultProps = {
  prefixCls: 'home'
};

export default Demo;
