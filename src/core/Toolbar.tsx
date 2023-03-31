import './style/index.less';

import { Button, InputNumber, Space } from 'antd';
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
   * 重做事件处理器
   */
  const onRestart = () => {
    onReload?.();
    componentDispatch({
      type: 'redo'
    });
  };

  /**
   * 撤销事件处理器
   */
  const onUndo = () => {
    componentDispatch({ type: 'undo' });
  };

  /**
   * 打开预览模式
   */
  const onPreview = () =>
    componentDispatch({ type: 'setPreview', payload: true });

  /**
   * 改变画布大小事件处理器
   * @param key
   * @param value
   */
  const onCanvasStyleChange = (key: string, value: number) =>
    componentDispatch({ type: 'setCanvasStyle', payload: { [key]: value } });

  return (
    <header className={prefixCls}>
      <Space size={12}>
        <Button size="small" onClick={onUndo}>
          撤销
        </Button>
        <Button size="small" onClick={onRestart}>
          重做
        </Button>
        <Button size="small" onClick={onPreview}>
          预览
        </Button>
        <Button size="small" onClick={onSave}>
          保存
        </Button>

        <Space>
          画布大小
          <InputNumber
            size="small"
            min={1}
            max={1200}
            defaultValue={1200}
            onChange={value => onCanvasStyleChange('width', value as number)}
          />
          *
          <InputNumber
            size="small"
            min={1}
            max={760}
            defaultValue={760}
            onChange={value => onCanvasStyleChange('height', value as number)}
          />
        </Space>
      </Space>
    </header>
  );
};

export default Toolbar;
