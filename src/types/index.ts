import { CSSProperties, DragEvent, HTMLAttributes, MouseEvent } from 'react';

export interface ComponentStyle {
  width?: number;
  height?: number;
  rotate?: number;
  opacity?: number;
  top?: number;
  left?: number;
}

export interface ComponentType {
  id?: number;
  name: string;
  label: string;
  props: HTMLAttributes<HTMLInputElement>;
  style: CSSProperties;
}

export type PointPosType = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l';

export type DragEventMethod = (e: DragEvent<HTMLDivElement> | any) => void;

export type MouseEventMethod = (e: MouseEvent<HTMLDivElement> | any) => void;

export type CalculateComponentMethod = (
  style: any,
  curPosition: any,
  proportion: any,
  needLockProportion: any,
  pointInfo: any
) => void;
