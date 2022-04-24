import './index.less';

import { find, forEach, isEmpty } from 'lodash-es';
import React, { FC, useContext } from 'react';

import { ComponentType } from '@/types';
import { transformStyle } from '@/utils';
import { events } from '@/utils/events';

import ComponentDataContext from '../../context/component-data';
import { generateComponent } from '../Shape';

interface ShapeProps {
  prefixCls?: string;
  component: ComponentType;
}

const Shape: FC<ShapeProps> = ({ prefixCls, component }) => {
  const { componentState } = useContext(ComponentDataContext);
  const { componentData } = componentState;

  const onClick = () => {
    const curComponent = find(componentData, ['id', component.id]);
    const curComponentEvents = curComponent?.events || [];
    if (!isEmpty(curComponentEvents)) {
      forEach(curComponentEvents, event => {
        events[event.key](event.value);
      });
    }
  };

  return (
    <div
      className={prefixCls}
      style={transformStyle(component.style)}
      onClick={onClick}
    >
      {generateComponent(component, 'preview')}
    </div>
  );
};

Shape.defaultProps = {
  prefixCls: 'visual-drag-shape'
};

export default Shape;
