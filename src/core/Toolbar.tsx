import './style/index.less';

import { Button, Space } from 'antd';
import React, { FC, useContext } from 'react';

import ComponentDataContext from '../core/context/component-data';

interface ToolbarProps {
  prefixCls?: string;
  onReload?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
  prefixCls = 'visual-drag-header',
  onReload
}) => {
  const { componentDispatch, componentState } =
    useContext(ComponentDataContext);
  const { componentData } = componentState;

  /**
   * 保存快照
   */
  const onSave = () => {
    componentDispatch({
      type: 'recordSnapshot',
      payload: {
        snapshots: [componentData]
      }
    });
  };

  /**
   * 重做事件处理
   */
  const onRestart = () => {
    onReload?.();
    componentDispatch({
      type: 'redo'
    });
  };

  /**
   * 撤销事件处理
   */
  const onUndo = () => {};

  return (
    <header className={prefixCls}>
      <Space>
        <Button onClick={onUndo}>撤销</Button>
        <Button onClick={onRestart}>重做</Button>
        <Button>预览</Button>
        <Button onClick={onSave}>保存</Button>
      </Space>
    </header>
  );
};

export default Toolbar;
