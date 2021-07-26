import { Card, Form, Input, Select, Tabs } from 'antd';
import { debounce, find, join, map } from 'lodash-es';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import { TObj } from '@/types';

import ComponentDataContext from '../context/component-data';
import { propertyConfigs } from './data';

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

interface PropertyProps {
  prefixCls?: string;
}

const initialValues = {
  opacity: undefined,
  width: undefined,
  height: undefined,
  fontSize: undefined,
  fontWeight: undefined,
  lineHeight: undefined,
  letterSpace: undefined,
  textAlign: undefined,
  label: undefined
};

const renderFormItem = map(propertyConfigs, config => {
  const { componentName, props, ...restProps } = config;
  let component;
  switch (componentName) {
    case 'select':
      component = <Select {...props} />;
      break;
    default:
      component = <Input {...props} />;
  }
  return (
    <FormItem key={restProps.name} {...restProps}>
      {component}
    </FormItem>
  );
});

const Property: FC<PropertyProps> = ({ prefixCls }) => {
  const { componentState } = useContext(ComponentDataContext);
  const { curComponentId, componentData, snapshots } = componentState;
  const [initial, setInitial] = useState<Record<string, any>>(initialValues);
  const [form] = Form.useForm();
  const firstRenderRef = useRef(true);

  const reset = debounce(form.resetFields, 100);

  useEffect(() => {
    let curComponentStyle: TObj = initialValues;
    if (curComponentId > -1) {
      const curComponent = find(componentData, ['id', curComponentId]);

      if (curComponent)
        curComponentStyle = {
          ...curComponent.style,
          label: curComponent.label
        };
    }
    setInitial(curComponentStyle);
  }, [curComponentId, componentData]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    reset();
  }, [initial]);

  return (
    <div className={prefixCls}>
      <Tabs defaultActiveKey="property">
        <TabPane forceRender tab="属性" key="property">
          <Form
            colon={false}
            form={form}
            labelCol={{ span: 4 }}
            initialValues={initial}
          >
            {renderFormItem}
          </Form>
        </TabPane>
        <TabPane tab="快照" key="animation">
          {map(snapshots, (snapshot, index) => {
            const names = join(map(snapshot, 'id'), ',');
            return (
              <Card key={`${index}`} title={`第 ${index + 1} 步`}>
                ids: {names}
              </Card>
            );
          })}
        </TabPane>
        <TabPane tab="事件" key="event">
          事件
        </TabPane>
      </Tabs>
    </div>
  );
};

Property.defaultProps = {
  prefixCls: 'visual-drag-property'
};

export default Property;
