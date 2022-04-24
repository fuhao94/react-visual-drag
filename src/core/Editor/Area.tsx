/**
 * Area
 * @Date:   2021-09-03 17:43
 */

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
