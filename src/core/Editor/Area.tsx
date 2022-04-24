import React, { FC } from 'react';

const prefixCls = 'visual-drag-area';

interface AreaProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

const Area: FC<AreaProps> = props => {
  return <div style={props} className={prefixCls} />;
};

export default Area;
