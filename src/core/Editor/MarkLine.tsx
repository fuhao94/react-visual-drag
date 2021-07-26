/**
 * 吸附线
 * @Date:   2021-07-23 11:00
 * @Author: zhangfuhao@mininglamp.com
 */
import { includes, map } from 'lodash-es';
import React, { FC, useContext, useEffect, useState } from 'react';

import ComponentDataContext from '../context/component-data';

type LineMap = 'xt' | 'xc' | 'xb' | 'yl' | 'yc' | 'yr';

// 六条吸附线 分别对应三条横线和三条竖线
const LINES_MAP: LineMap[] = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'];
// 相距 LINE_DIFF 像素将自动吸附
const LINE_DIFF = 3;

interface MarkLineProps {
  prefixCls?: string;
}

const MarkLine: FC<MarkLineProps> = ({ prefixCls }) => {
  const { componentState } = useContext(ComponentDataContext);
  const { curComponentId, componentData } = componentState;

  const [lineStatus, setLineStatus] = useState({
    xt: false,
    xc: false,
    xb: false,
    yl: false,
    yc: false,
    yr: false
  });

  return (
    <div className={prefixCls}>
      {map(LINES_MAP, line => (
        <div
          key="line"
          className={`${prefixCls}-line ${
            includes(line, 'x') ? `${prefixCls}-xline` : `${prefixCls}-yline`
          }`}
          style={{ display: lineStatus[line] ? 'block' : 'none' }}
        />
      ))}
    </div>
  );
};

MarkLine.defaultProps = {
  prefixCls: 'visual-drag-mark'
};

export default MarkLine;
