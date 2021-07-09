import { ComponentType } from '@/types';

export const COMPONENT_LIST: ComponentType[] = [
  {
    name: 'r-input',
    label: '文字',
    props: {
      placeholder: '请输入'
    },
    style: {
      width: 200
    }
  },
  {
    name: 'r-button',
    label: '按钮',
    props: {},
    style: {
      width: 100,
      height: 32
    }
  }
];
