import { Card, Form, Input, Select, Tabs } from 'antd';
import { FormProps } from 'antd/es/form';
import { debounce, find, join, map, omit } from 'lodash-es';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import { TObj } from '@/types';

import ComponentDataContext from '../context/component-data';
import { propertyConfigs } from './data';
import Event from './Event';
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

const propFields = ['label'];

/**
 * 渲染不同类型的组件
 * @return {ReactNode}
 */
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
  const { componentState, curComponentIndex, componentDispatch } =
    useContext(ComponentDataContext);
  const { curComponentId, componentData, snapshots } = componentState;
  const [initial, setInitial] = useState<Record<string, any>>(initialValues);
  const [form] = Form.useForm();
  const firstRenderRef = useRef(true);

  const reset = debounce(form.resetFields, 100);

  /**
   * 改变组件的属性值
   */
  const setComponentContext = debounce(config => {
    componentDispatch({
      type: 'setComponentProps',
      payload: { index: curComponentIndex, config }
    });
  }, 1000);

  /**
   * 表单值处理
   * @param changedValues
   * @param values
   */
  const onValuesChange: FormProps['onValuesChange'] = (
    changedValues,
    values
  ) => {
    const { label } = values;
    const curStyle = omit(values, propFields);
    if (curComponentIndex > -1) {
      const style = { ...componentData[curComponentIndex].style, ...curStyle };
      setComponentContext({ label, style });
    }
  };

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
          {curComponentId > -1 ? (
            <Form
              colon={false}
              form={form}
              labelCol={{ span: 4 }}
              initialValues={initial}
              onValuesChange={onValuesChange}
            >
              {renderFormItem}
            </Form>
          ) : (
            '请选择组件'
          )}
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
          <Event />
        </TabPane>
      </Tabs>
    </div>
  );
};

Property.defaultProps = {
  prefixCls: 'visual-drag-property'
};

export default Property;
