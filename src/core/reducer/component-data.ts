import { message } from 'antd';
import { cloneDeep, findIndex, includes } from 'lodash-es';
import { CSSProperties } from 'react';

import { ComponentType } from '@/types';
import { generateID } from '@/utils';

/**
 * 保存组件数据源
 * 改变组件样式
 * 删除组件
 * 设置当前组件
 * 设置 active 状态
 * 撤销
 * 重做
 * 复制
 * 黏贴
 * 置顶
 * 置底
 * 上移
 * 下移
 * 保存快照
 * 修改当前组件位移
 * 预览状态
 * 添加事件
 * 移除事件
 * 设置画布样式
 * */
export type ComponentDataReducerActionType =
  | 'setComponentData'
  | 'setComponentProps'
  | 'setComponentStyle'
  | 'destroyComponent'
  | 'setCurComponent'
  | 'setClick'
  | 'undo'
  | 'redo'
  | 'copy'
  | 'paste'
  | 'top'
  | 'bottom'
  | 'up'
  | 'down'
  | 'recordSnapshot'
  | 'setCurComponentDragShift'
  | 'setPreview'
  | 'createEvents'
  | 'removeEvents'
  | 'setCanvasStyle';

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
  /** 预览模式状态 */
  preview: boolean;
  /** 快照保存 */
  snapshots: ComponentType[][];
  /** 当前属于哪级快照的索引 */
  snapshotIndex: number;
  /** 当前需要组件需要操作的样式 */
  dragShiftStyle: CSSProperties;
  /** 画布的样式 默认只有宽高 */
  canvasStyle: Record<string, number>;
  /** 复制的数据 */
  copyData?: ComponentType;
}

const needIndexTypes = [
  'destroyComponent',
  'createEvents',
  'removeEvents',
  'bottom',
  'copy',
  'down',
  'top',
  'up'
];

/**
 * 替换下组件位置 up down top bottom 等操作
 * @param components
 * @param source
 * @param target
 */
const replaceComponentsLocation = (
  components: ComponentType[],
  source: number,
  target: number
) => {
  [components[source], components[target]] = [
    components[target],
    components[source]
  ];
  return components;
};

export default function reducer(
  state: ComponentDataReducerState,
  action: ComponentDataReducerAction
) {
  const { type, payload } = action;
  let curComponentIndex = -1;

  if (includes(needIndexTypes, type)) {
    curComponentIndex = findIndex(state.componentData, [
      'id',
      state.curComponentId
    ]);
  }

  switch (type) {
    case 'setComponentData': {
      return { ...state, componentData: payload };
    }
    case 'setComponentProps': {
      const { config, index } = payload;
      const componentData = cloneDeep(state.componentData);
      Object.assign(componentData[index], { ...config });
      return { ...state, componentData };
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
        curIndex = curComponentIndex;
      }
      if (curIndex > -1) {
        newComponents.splice(curIndex, 1);
      }
      return { ...state, componentData: newComponents };
    }
    case 'setCurComponent':
      return {
        ...state,
        curComponentId: payload.id
      };
    case 'setCurComponentDragShift':
      return {
        ...state,
        dragShiftStyle: payload
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
    case 'copy':
      return { ...state, copyData: state.componentData[curComponentIndex] };
    case 'paste': {
      const data = cloneDeep(state.copyData);
      if (!data) {
        message.error('请选择组件');
        return state;
      }
      Object.assign(data, {
        style: { ...data.style, ...payload },
        id: generateID()
      });
      return { ...state, componentData: [...state.componentData, data] };
    }
    case 'top': {
      const newComponents = [...state.componentData];
      // 容错处理
      if (newComponents.length < 2) {
        return state;
      }
      return {
        ...state,
        componentData: replaceComponentsLocation(
          newComponents,
          curComponentIndex,
          newComponents.length - 1
        )
      };
    }
    case 'bottom': {
      const newComponents = [...state.componentData];
      // 容错处理
      if (newComponents.length < 2) {
        return state;
      }
      return {
        ...state,
        componentData: replaceComponentsLocation(
          newComponents,
          curComponentIndex,
          0
        )
      };
    }
    case 'up': {
      const newComponents = [...state.componentData];
      // 容错处理
      if (
        newComponents.length < 2 ||
        curComponentIndex === newComponents.length - 1
      ) {
        return state;
      }
      return {
        ...state,
        componentData: replaceComponentsLocation(
          newComponents,
          curComponentIndex,
          curComponentIndex + 1
        )
      };
    }
    case 'down': {
      const newComponents = [...state.componentData];
      // 容错处理
      if (newComponents.length < 2 || curComponentIndex === 0) {
        return state;
      }
      return {
        ...state,
        componentData: replaceComponentsLocation(
          newComponents,
          curComponentIndex,
          curComponentIndex - 1
        )
      };
    }
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
    case 'setPreview':
      return { ...state, preview: payload };
    case 'createEvents': {
      const componentData = cloneDeep(state.componentData);
      const curComponent = componentData[curComponentIndex];
      curComponent.events = curComponent.events || [];
      const replaceEventIndex = findIndex(curComponent.events, [
        'key',
        payload.key
      ]);
      if (replaceEventIndex > -1) {
        curComponent.events.splice(replaceEventIndex, 1, payload);
      } else {
        curComponent.events.push(payload);
      }
      return { ...state, componentData };
    }
    case 'removeEvents':
      return { ...state, preview: payload };
    case 'setCanvasStyle':
      return { ...state, canvasStyle: { ...state.canvasStyle, ...payload } };
    default:
      throw new Error();
  }
}
