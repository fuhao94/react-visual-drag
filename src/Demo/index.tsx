/**
 * 演示
 * @Date:   2021-07-26 10:43
 * @Author: zhangfuhao@mininglamp.com
 */

import './index.less';

import React, { FC, useState } from 'react';

import { ComponentType, DragEventMethod } from '@/types';

import Editor from './Editor';

interface DemoProps {
  prefixCls?: string;
}

const Demo: FC<DemoProps> = ({ prefixCls }) => {
  const [data, setData] = useState<ComponentType>({
    id: 1,
    name: 'r-button',
    label: '按钮',
    props: {},
    style: {
      width: 100,
      height: 32,
      opacity: 1,
      top: 75,
      left: 100
    }
  });

  const onDragOver: DragEventMethod = e => {
    // 允许放置的条件
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-content-wrapper`}>
          <div
            className={`${prefixCls}-content-wrapper-canvas`}
            onDragOver={onDragOver}
          >
            <Editor data={data} setData={setData} />
          </div>
        </div>
      </div>
    </div>
  );
};

Demo.defaultProps = {
  prefixCls: 'demo'
};

export default Demo;
