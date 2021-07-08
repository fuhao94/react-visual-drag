import { CSSProperties, DragEvent, HTMLAttributes, MouseEvent } from 'react';

export interface ComponentType {
  id?: number;
  name: string;
  label: string;
  props: HTMLAttributes<HTMLInputElement>;
  style: CSSProperties;
}

export type DragEventMethod = (e: DragEvent<HTMLDivElement> | any) => void;
export type MouseEventMethod = (e: MouseEvent<HTMLDivElement> | any) => void;
