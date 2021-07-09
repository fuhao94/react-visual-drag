import { createContext, CSSProperties } from 'react';

import { ComponentType } from '@/types';

export interface ComponentDataContextType {
  dataSource: ComponentType[];
  onShapeMove?: (pos: CSSProperties, index: number) => void;
  curComponent?: ComponentType;
  setCurComponent?: (value: ComponentType) => void;
  onDestroyComponent?: (index?: number) => void;
}

const Context = createContext<ComponentDataContextType>({ dataSource: [] });

export default Context;