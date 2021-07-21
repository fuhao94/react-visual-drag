import { ContextMenuPosition } from '@/types';

/**
 * 显示
 * 隐藏
 * 设置位置
 */
export type ComponentDataReducerActionType = 'hide' | 'show' | 'setPosition';

export interface ComponentDataReducerAction {
  type: ComponentDataReducerActionType;
  payload?: any;
}

export interface ContextMenuReducerState {
  visible: boolean;
  position: ContextMenuPosition;
}

export default function reducer(
  state: ContextMenuReducerState,
  action: ComponentDataReducerAction
) {
  const { type, payload } = action;

  switch (type) {
    case 'show':
      return { ...state, visible: true };
    case 'hide':
      return { ...state, visible: false };
    case 'setPosition':
      return { ...state, position: payload };
  }
}
