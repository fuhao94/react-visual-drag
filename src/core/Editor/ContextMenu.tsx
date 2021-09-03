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

  /**
   * 删除操作
   */
  const onDestroy = () => componentDispatch({ type: 'destroyComponent' });

  /**
   * 复制操作
   */
  const onCopy = () => componentDispatch({ type: 'copy' });

  /**
   * 黏贴操作
   */
  const onPaste = () => componentDispatch({ type: 'paste', payload: position });

  /**
   * 置顶操作
   */
  const onTop = () => componentDispatch({ type: 'top' });

  /**
   * 置底操作
   */
  const onBottom = () => componentDispatch({ type: 'bottom' });

  /**
   * 上移操作
   */
  const onUp = () => componentDispatch({ type: 'up' });

  /**
   * 下移操作
   */
  const onDown = () => componentDispatch({ type: 'down' });

  return (
    <div
      className={prefixCls}
      style={{ visibility: visible ? 'visible' : 'hidden', ...position }}
    >
      <ul
        onMouseUp={() => componentDispatch({ type: 'setClick', payload: true })}
      >
        <li onClick={onCopy}>复制</li>
        <li onClick={onPaste}>粘贴</li>
        <li onClick={onDestroy}>删除</li>
        <li onClick={onTop}>置顶</li>
        <li onClick={onBottom}>置底</li>
        <li onClick={onUp}>上移</li>
        <li onClick={onDown}>下移</li>
      </ul>
    </div>
  );
};

ContextMenu.defaultProps = {
  prefixCls: 'visual-drag-menu'
};

export default ContextMenu;
