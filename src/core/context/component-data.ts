import { createContext } from 'react';

import {
  ComponentDataReducerAction,
  ComponentDataReducerState
} from '../reducer/component-data';

export interface ComponentDataContextType {
  componentState: ComponentDataReducerState;
  curComponentIndex: number;
  componentDispatch: ({ type, payload }: ComponentDataReducerAction) => void;
}

const Context = createContext<ComponentDataContextType>({
  componentDispatch: () => {},
  curComponentIndex: -1,
  componentState: {
    componentData: [],
    isClickComponent: false,
    preview: false,
    snapshots: [],
    snapshotIndex: -1,
    curComponentId: -1,
    dragShiftStyle: {}
  }
});

export default Context;
