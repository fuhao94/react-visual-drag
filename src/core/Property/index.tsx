import { Form, Input, Select, Tabs } from 'antd';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

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
  textAlign: undefined
};

const renderFormItem = propertyConfigs.map(config => {
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
  const { curComponent } = componentState;
  const [initial, setInitial] = useState<Record<string, any>>(initialValues);
  const [form] = Form.useForm();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    setInitial(curComponent ? curComponent.style : initialValues);
  }, [curComponent]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    console.log('render');
    form.resetFields();
  }, [initial]);

  return (
    <div className={prefixCls}>
      <Tabs>
        <TabPane tab="属性" key="property">
          <Form
            colon={false}
            form={form}
            labelCol={{ span: 4 }}
            initialValues={initial}
          >
            {renderFormItem}
          </Form>
        </TabPane>
        <TabPane tab="动画" key="animation">
          动画
        </TabPane>
        <TabPane tab="事件" key="event">
          事件
        </TabPane>
      </Tabs>

      <span>当前组件ID：{componentState.curComponent?.id}</span>
      <br />
      <br />
      {JSON.stringify(
        componentState.snapshots.map(snap => snap.map(com => com.id))
      )}
    </div>
  );
};

Property.defaultProps = {
  prefixCls: 'visual-drag-property'
};

export default Property;
