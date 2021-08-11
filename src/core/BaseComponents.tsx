import {
  BoldOutlined,
  FileImageOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { map } from 'lodash-es';
import React, { FC } from 'react';

import { DragEventMethod } from '@/types';

import { COMPONENT_LIST } from './data';

const maps = {
  'r-button': <BoldOutlined />,
  'r-input': <FileTextOutlined />,
  'r-img': <FileImageOutlined />
};

type MapKey = keyof typeof maps;

function getIcon(name: MapKey) {
  return maps[name];
}

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
        {map(COMPONENT_LIST, ({ label, name }, index) => (
          <Col
            span={12}
            key={label}
            style={{ marginBottom: 12, textAlign: 'center' }}
          >
            <Button icon={getIcon(name as MapKey)} data-index={index} draggable>
              {label}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BaseComponents;
