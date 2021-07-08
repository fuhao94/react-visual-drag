import { Button } from 'antd';
import React, { FC } from 'react';

import { DragEventMethod } from '@/types';

import { COMPONENT_LIST } from './data';

const BaseComponents: FC = () => {
  const onDragStart: DragEventMethod = e => {
    e.dataTransfer.setData('index', e.target.dataset.index);
  };

  return (
    <div onDragStart={onDragStart}>
      {COMPONENT_LIST.map(({ label }, index) => (
        <Button key={label} data-index={index} draggable>
          {label}
        </Button>
      ))}
    </div>
  );
};

export default BaseComponents;
