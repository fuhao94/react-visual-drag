import './index.less';

import React, { CSSProperties, FC, useState } from 'react';

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
import Toolbar from '../core/Toolbar';

interface DemoProps {
  prefixCls?: string;
}

const Demo: FC<DemoProps> = ({ prefixCls }) => {
  const [dataSource, setDataSource] = useState<ComponentType[]>([]);
  const [curComponent, setCurComponent] = useState<ComponentType>();
  const [isClickComponent, setIsClickComponent] = useState(false);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({
    left: 0,
    top: 0
  });

  const onComponentStyleChange = (pos: CSSProperties, index: number) => {
    const newComponents = [...dataSource];
    Object.assign(newComponents[index], { style: pos });
    setDataSource(newComponents);
  };

  const onDrop: DragEventMethod = e => {
    e.preventDefault();
    e.stopPropagation();
    const component = cloneDeep(
      COMPONENT_LIST[Number(e.dataTransfer.getData('index'))]
    );
    // FIXME 落地的位置有偏差(猜测是计算的距离是根据中心点算的)
    component.style.top = e.nativeEvent.offsetY;
    component.style.left = e.nativeEvent.offsetX;
    component.id = generateID();
    setDataSource(prev => [component, ...prev]);
  };

  const onDragOver: DragEventMethod = e => {
    // 允许放置的条件
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onMouseUp: DragEventMethod = e => {
    if (!isClickComponent) {
      setCurComponent(undefined);
    }

    if (e.button !== 2) {
      setVisible(false);
    }
  };

  const onDestroyComponent = (index?: number) => {
    const newData = [...dataSource];

    let curIndex = index;

    if (curIndex === undefined) {
      curIndex = newData.findIndex(
        component => component.id === curComponent?.id
      );
    }

    if (curIndex > -1) {
      newData.splice(curIndex, 1);
      setDataSource(newData);
    }
  };

  return (
    <div className={prefixCls}>
      <ComponentDataContext.Provider
        value={{
          dataSource,
          curComponent,
          setCurComponent,
          onComponentStyleChange,
          onDestroyComponent,
          isClickComponent,
          setIsClickComponent
        }}
      >
        <Toolbar onReload={() => setDataSource([])} />
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
              onMouseDown={() => setIsClickComponent(false)}
            >
              <ContextMenuContext.Provider
                value={{ visible, setVisible, position, setPosition }}
              >
                <Editor dataSource={dataSource} />
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
