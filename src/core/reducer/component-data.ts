import { cloneDeep } from 'lodash-es';

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
  | 'setCurComponentId'
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
  /** 当前组件索引 */
  curComponentId: number;
  /** 是否是 active 组件 */
  isClickComponent: boolean;
  snapshots: ComponentType[][];
  snapshotIndex: number;
}

export default function reducer(
  state: ComponentDataReducerState,
  action: ComponentDataReducerAction
) {
  const { type, payload } = action;
  switch (type) {
    case 'setComponentData': {
      return { ...state, componentData: payload };
    }
    case 'setComponentStyle': {
      const { style, index } = payload;
      const newState = cloneDeep(state);
      Object.assign(newState.componentData[index], { style });
      return newState;
    }
    case 'destroyComponent': {
      const newComponents = [...state.componentData];
      let curIndex = payload;
      if (curIndex === undefined) {
        curIndex = state.curComponentId;
      }
      if (curIndex > -1) {
        newComponents.splice(curIndex, 1);
      }
      return { ...state, componentData: newComponents };
    }
    case 'setCurComponentId':
      return {
        ...state,
        curComponentId: payload
      };
    case 'setClick':
      return { ...state, isClickComponent: payload };
    case 'undo': {
      const newState = { ...state };
      // 撤销回最开始时候是原始值 []
      newState.componentData =
        newState.snapshots[--newState.snapshotIndex] || [];
      return newState;
    }
    case 'redo':
      return { ...state, componentData: [], snapshots: [], snapshotIndex: 0 };
    case 'recordSnapshot': {
      const newState = { ...state };
      newState.snapshots[++newState.snapshotIndex] = payload
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
