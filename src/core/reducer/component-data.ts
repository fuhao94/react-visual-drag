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

export interface ComponentDataReducerAction<K, T extends keyof K = keyof K> {
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
  action: ComponentDataReducerAction<ComponentDataReducerState>
) {
  const newState = { ...state };
  const { type, payload } = action;
  switch (type) {
    case 'setComponentData': {
      return { ...newState, componentData: payload };
    }
    case 'setComponentStyle': {
      const { style, index } = payload;
      const newComponents = [...newState.componentData];
      Object.assign(newComponents[index], { style });
      return { ...newState, componentData: newComponents };
    }
    case 'destroyComponent': {
      const newComponents = [...newState.componentData];
      let curIndex = payload;
      if (curIndex === undefined) {
        curIndex = newComponents.findIndex(
          component => component.id === newState.curComponent?.id
        );
      }
      if (curIndex > -1) {
        newComponents.splice(curIndex, 1);
      }
      return { ...newState, componentData: newComponents };
    }
    case 'setCurComponent':
      return { ...newState, curComponent: payload };
    case 'setClick':
      return { ...newState, isClickComponent: payload };
    case 'undo':
    case 'redo':
      return { ...state, componentData: [], snapshots: [], snapshotIndex: 0 };
    case 'recordSnapshot':
      newState.snapshots[newState.snapshotIndex++] = payload
        ?.snapshots?.[0] as ComponentType[];
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (newState.snapshotIndex < newState.snapshots.length - 1) {
        newState.snapshots = newState.snapshots.slice(
          0,
          newState.snapshotIndex + 1
        );
      }
      return newState;
    default:
      throw new Error();
  }
}
