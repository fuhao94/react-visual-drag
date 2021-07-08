import './style/index.less';

import { Button, Space } from 'antd';
import React, { FC } from 'react';

interface ToolbarProps {
  prefixCls?: string;
  onReload?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
  prefixCls = 'visual-drag-header',
  onReload
}) => {
  return (
    <header className={prefixCls}>
      <Space>
        <Button>撤销</Button>
        <Button onClick={onReload}>重做</Button>
        <Button>预览</Button>
        <Button>报错</Button>
      </Space>
    </header>
  );
};

export default Toolbar;
