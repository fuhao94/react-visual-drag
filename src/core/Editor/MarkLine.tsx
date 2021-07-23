/**
 * 吸附线
 * @Date:   2021-07-23 11:00
 * @Author: zhangfuhao@mininglamp.com
 */
import React, { FC, useContext, useEffect, useState } from 'react';

import ComponentDataContext from '../context/component-data';

// 六条吸附线 分别对应三条横线和三条竖线
const LINES_MAP = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'];
// 相距 LINE_DIFF 像素将自动吸附
const LINE_DIFF = 3;

const MarkLine: FC = () => {
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

  useEffect(() => {
    const move = (e: any) => {};

    // document.addEventListener('mousemove', move);

    return () => {
      // document.removeEventListener('mousemove', move);
    };
  }, []);

  return <div>123</div>;
};

export default MarkLine;
