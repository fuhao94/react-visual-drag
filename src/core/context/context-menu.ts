import { createContext } from 'react';

export interface ContextMenuPosition {
  top: number;
  left: number;
}

export interface ContextMenuType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  position: ContextMenuPosition;
  setPosition: (position: ContextMenuPosition) => void;
}

const Context = createContext<ContextMenuType>({
  visible: false,
  position: { left: 0, top: 0 },
  setVisible: () => {},
  setPosition: () => {}
});

export default Context;
