import './index.less';

import { Modal } from 'antd';
import { map } from 'lodash-es';
import React, { FC, useContext } from 'react';

import ComponentDataContext from '../../context/component-data';
import Shape from './Shape';

interface PreviewProps {
  prefixCls?: string;
}

const Preview: FC<PreviewProps> = ({ prefixCls }) => {
  const { componentState, componentDispatch } =
    useContext(ComponentDataContext);
  const { componentData, preview, canvasStyle } = componentState;

  const onClose = () =>
    componentDispatch({ type: 'setPreview', payload: false });

  return (
    <Modal
      visible={preview}
      footer={null}
      closable={false}
      width={canvasStyle.width}
      style={{ ...canvasStyle, top: 50 }}
      className={prefixCls}
      onCancel={onClose}
    >
      {map(componentData, component => {
        return <Shape key={component.id} component={component} />;
      })}
    </Modal>
  );
};

Preview.defaultProps = {
  prefixCls: 'visual-drag-preview'
};

export default Preview;
