import { Button, Drawer, Input, message, Tabs } from 'antd';
import React, { FC, useContext, useState } from 'react';
const { TabPane } = Tabs;
import { map } from 'lodash-es';

import { ComponentTypeEventKey } from '@/types';
import { eventList } from '@/utils/events';

import ComponentDataContext from '../context/component-data';

const Event: FC = () => {
  const { componentDispatch, componentState } =
    useContext(ComponentDataContext);
  const { curComponentId } = componentState;
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [tab, setTab] = useState<ComponentTypeEventKey>('message');

  return (
    <div>
      {curComponentId > -1 && (
        <Button type="primary" onClick={() => setVisible(true)}>
          添加事件
        </Button>
      )}

      <Drawer
        width={320}
        placement="right"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Tabs
          activeKey={tab}
          onChange={activeKey => setTab(activeKey as ComponentTypeEventKey)}
        >
          {map(eventList, eventItem => (
            <TabPane tab={eventItem.label} key={eventItem.key}>
              <Input.TextArea
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            </TabPane>
          ))}
        </Tabs>

        <Button
          style={{ marginTop: 24 }}
          onClick={() => {
            componentDispatch({
              type: 'createEvents',
              payload: {
                key: tab,
                value
              }
            });
            setValue('');
            message.success('事件添加成功');
            setVisible(false);
          }}
        >
          确认
        </Button>
      </Drawer>
    </div>
  );
};

export default Event;
