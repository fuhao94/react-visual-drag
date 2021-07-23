import { Button, Col, Row } from 'antd';
import { map } from 'lodash-es';
import React, { FC } from 'react';

import { DragEventMethod } from '@/types';

import { COMPONENT_LIST } from './data';

const BaseComponents: FC = () => {
  /**
   * 用于保存拖动并放下（drag and drop）过程中的数据
   * @param e { DragEvent<HTMLDivElement> }
   */
  const onDragStart: DragEventMethod = e => {
    e.dataTransfer.setData('index', e.target.dataset.index);
  };

  return (
    <div onDragStart={onDragStart}>
      <Row>
        {map(COMPONENT_LIST, ({ label }, index) => (
          <Col
            span={10}
            key={label}
            style={{ marginBottom: 6, textAlign: 'center' }}
          >
            <Button data-index={index} draggable>
              {label}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BaseComponents;
