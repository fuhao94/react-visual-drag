import { ComponentType } from '@/types';

/**
 * 保存组件数据源
 * 改变组件样式
 * 删除组件
 * 设置当前组件
 * 设置 active 状态
 * 撤销
 * 重做
 * 保存快照
 * */
export type ComponentDataReducerActionType =
  | 'setComponentData'
  | 'setComponentStyle'
  | 'destroyComponent'
  | 'setCurComponent'
  | 'setClick'
  | 'undo'
  | 'redo'
  | 'recordSnapshot';

export interface ComponentDataReducerAction {
  type: ComponentDataReducerActionType;
  payload?: any;
}

export interface ComponentDataReducerState {
  /** 数据源 */
  componentData: ComponentType[];
  /** 当前组件 */
  curComponent?: ComponentType;
  /** 是否是 active 组件 */
  isClickComponent: boolean;
  snapshots: ComponentType[][];
  snapshotIndex: number;
}

export default function reducer(
  state: ComponentDataReducerState,
  action: ComponentDataReducerAction
) {
  switch (action.type) {
    case 'setComponentData': {
      return { ...state, componentData: action.payload };
    }
    case 'setComponentStyle': {
      const { style, index } = action.payload;
      const newComponents = [...state.componentData];
      Object.assign(newComponents[index], { style });
      return { ...state, componentData: newComponents };
    }
    case 'destroyComponent': {
      const newComponents = [...state.componentData];
      let curIndex = action.payload;
      if (curIndex === undefined) {
        curIndex = newComponents.findIndex(
          component => component.id === state.curComponent?.id
        );
      }
      if (curIndex > -1) {
        newComponents.splice(curIndex, 1);
      }
      return { ...state, componentData: newComponents };
    }
    case 'setCurComponent':
      return { ...state, curComponent: action.payload };
    case 'setClick':
      return { ...state, isClickComponent: action.payload };
    case 'undo':
    case 'redo':
      return { ...state, componentData: [], snapshots: [], snapshotIndex: 0 };
    case 'recordSnapshot': {
      const newState = { ...state };
      newState.snapshots[newState.snapshotIndex++] = action.payload
        ?.snapshots?.[0] as ComponentType[];
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (newState.snapshotIndex < newState.snapshots.length - 1) {
        newState.snapshots = newState.snapshots.slice(
          0,
          newState.snapshotIndex + 1
        );
      }
      return newState;
    }
    default:
      throw new Error();
  }
}
