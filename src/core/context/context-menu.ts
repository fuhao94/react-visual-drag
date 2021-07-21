import { createContext } from 'react';

import {
  ComponentDataReducerAction,
  ContextMenuReducerState
} from '../reducer/context-menu';

export interface ContextMenuType {
  menuState: ContextMenuReducerState;
  menuDispatch: ({ type, payload }: ComponentDataReducerAction) => void;
}

const Context = createContext<ContextMenuType>({
  menuDispatch: () => {},
  menuState: {
    visible: false,
    position: { left: 0, top: 0 }
  }
});

export default Context;
