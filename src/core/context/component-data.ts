import { createContext } from 'react';

import {
  ComponentDataReducerAction,
  ComponentDataReducerState
} from '../reducer/component-data';

export interface ComponentDataContextType {
  componentState: ComponentDataReducerState;
  componentDispatch: ({ type, payload }: ComponentDataReducerAction) => void;
}

const Context = createContext<ComponentDataContextType>({
  componentDispatch: () => {},
  componentState: {
    componentData: [],
    isClickComponent: false,
    snapshots: [],
    snapshotIndex: -1,
    curComponentId: -1
  }
});

export default Context;
