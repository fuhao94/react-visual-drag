import './index.less';

import React, { FC, useContext } from 'react';

import ComponentDataContext from '../context/component-data';
import ContextMenuContext from '../context/context-menu';

interface ContextMenuProps {
  prefixCls?: string;
}

const ContextMenu: FC<ContextMenuProps> = ({ prefixCls }) => {
  const { componentDispatch } = useContext(ComponentDataContext);
  const { menuState } = useContext(ContextMenuContext);
  const { visible, position } = menuState;

  return (
    <div
      className={prefixCls}
      style={{ visibility: visible ? 'visible' : 'hidden', ...position }}
    >
      <ul
        onMouseUp={() => componentDispatch({ type: 'setClick', payload: true })}
      >
        <li>复制</li>
        <li>粘贴</li>
        <li>剪切</li>
        <li onClick={() => componentDispatch({ type: 'destroyComponent' })}>
          删除
        </li>
        <li>置顶</li>
        <li>置底</li>
        <li>上移</li>
        <li>下移</li>
      </ul>
    </div>
  );
};

ContextMenu.defaultProps = {
  prefixCls: 'visual-drag-menu'
};

export default ContextMenu;
