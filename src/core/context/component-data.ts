import { createContext, CSSProperties } from 'react';

import {
  ComponentDataReducerAction,
  ComponentDataReducerState
} from '../reducer/component-data';

export interface ComponentDataContextType {
  componentState: ComponentDataReducerState;
  componentDispatch: ({
    type,
    payload
  }: ComponentDataReducerAction<ComponentDataReducerState>) => void;
}

const Context = createContext<ComponentDataContextType>({
  componentDispatch: () => {},
  componentState: {
    componentData: [],
    isClickComponent: false,
    snapshots: [],
    snapshotIndex: 0
  }
});

export default Context;
