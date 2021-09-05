import './index.less';

import { cloneDeep, findIndex } from 'lodash-es';
import React, { FC, useMemo, useReducer } from 'react';

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
    isClickComponent: false,
    preview: false,
    snapshotIndex: -1,
    curComponentId: -1,
    snapshots: [],
    dragShiftStyle: {},
    canvasStyle: { width: 1200, height: 760 },
    componentData: [
      {
        id: 0,
        name: 'r-button',
        label: '按钮',
        props: {},
        style: {
          width: 100,
          height: 32,
          borderWidth: 1,
          borderColor: '',
          borderRadius: '',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '',
          letterSpacing: 0,
          textAlign: '',
          color: '',
          backgroundColor: '',
          rotate: 0,
          opacity: 1,
          top: 86,
          left: 117
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
          borderWidth: 1,
          borderColor: '',
          borderRadius: '',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '',
          letterSpacing: 0,
          textAlign: '',
          color: '',
          backgroundColor: '',
          rotate: 0,
          opacity: 1,
          top: 130,
          left: 150
        }
      }
    ]
  });
  const [menuState, menuDispatch] = useReducer(contextReducer, {
    visible: false,
    position: { left: 0, top: 0 }
  });
  const { componentData, isClickComponent, curComponentId } = componentState;

  // active 组件的索引
  const curComponentIndex = useMemo(
    () => findIndex(componentData, ['id', curComponentId]),
    [componentData, curComponentId]
  );

  /**
   * 组件模板拖拽到画布的事件(添加组件)
   * @param e {DragEvent<HTMLDivElement>}
   */
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

  /**
   * 基础组件拖动到画布中的事件(ps: 不可使用 onDragEnter)
   * @param e {DragEvent<HTMLDivElement>}
   */
  const onDragOver: DragEventMethod = e => {
    // 允许放置的条件
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  /**
   * 鼠标抬起事件
   * @param e
   */
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
    // 右击操作
    if (e.button !== 2) {
      menuDispatch({ type: 'hide' });
    }
  };

  return (
    <div className={prefixCls}>
      <ComponentDataContext.Provider
        value={{
          curComponentIndex,
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
