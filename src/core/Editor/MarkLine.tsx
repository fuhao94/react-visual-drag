/**
 * 吸附线
 * @Date:   2021-07-23 11:00
 * @Author: zhangfuhao@mininglamp.com
 */
import { find, forEach, includes, map, values } from 'lodash-es';
import React, {
  CSSProperties,
  forwardRef,
  useContext,
  useImperativeHandle,
  useState
} from 'react';

import { getComponentRotatedStyle } from '@/utils';

import ComponentDataContext from '../context/component-data';

type LineMap = 'xt' | 'xc' | 'xb' | 'yl' | 'yc' | 'yr';

// 六条吸附线 分别对应三条横线和三条竖线
const LINES_MAP: LineMap[] = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'];
// 相距 LINE_DIFF 像素将自动吸附
const LINE_DIFF = 3;
const INIT_LINE_STATUS = {
  xt: false,
  xc: false,
  xb: false,
  yl: false,
  yc: false,
  yr: false
};
const INIT_LINE_STYLE = {
  xt: {},
  xc: {},
  xb: {},
  yl: {},
  yc: {},
  yr: {}
};

interface MarkLineProps {
  prefixCls?: string;
}

export interface MarkLineRefProps {
  showLine: (style: CSSProperties) => void;
  hideLine: () => void;
}

/**
 * 判断是否需要显示吸附线 <= diff 像素
 * @param dragValue
 * @param targetValue
 */
function decideIsNearly(dragValue: number, targetValue: number) {
  return Math.abs(dragValue - targetValue) <= LINE_DIFF;
}

const MarkLine = forwardRef<MarkLineRefProps, MarkLineProps>(
  ({ prefixCls }, ref) => {
    const { componentState, componentDispatch } =
      useContext(ComponentDataContext);
    const { curComponentId, componentData } = componentState;
    const [lineStatus, setLineStatus] = useState(INIT_LINE_STATUS);
    const [lineStyle, setLineStyle] = useState(INIT_LINE_STYLE);

    /**
     * 选择性的显示吸附线
     * 处理多条吸附线共存的问题
     * @param newLineStatus
     */
    const onChooseTheTureLine = (newLineStatus: typeof INIT_LINE_STATUS) => {
      // const { xt, xc, xb, yl, yc, yr } = newLineStatus;
      //
      // if ((xt && xc && xb) || (yl && yc && yr)) {
      //   if (xt && xc && xb) {
      //     setLineStatus({ ...newLineStatus, xt: false, xc: true, xb: false });
      //   }
      //
      //   if (yl && yc && yr) {
      //     setLineStatus({ ...newLineStatus, yl: false, yc: true, yr: false });
      //   }
      //   return;
      // }

      setLineStatus(newLineStatus);
    };

    /**
     * 判断是否显示吸附线 && 计算吸附线坐标
     * @param style {CSSProperties}
     */
    const showLine: MarkLineRefProps['showLine'] = style => {
      const curComponentStyle = getComponentRotatedStyle(style);
      const curComponentHalfWidth = Number(curComponentStyle.width) / 2;
      const curComponentHalfHeight = Number(curComponentStyle.height) / 2;
      const curComponentWidth = Number(curComponentStyle.width);
      const curComponentHeight = Number(curComponentStyle.height);
      const curComponentLeft = Number(curComponentStyle.left);
      const curComponentRight = Number(curComponentStyle.right);
      const curComponentTop = Number(curComponentStyle.top);
      const curComponentBottom = Number(curComponentStyle.bottom);

      forEach(componentData, component => {
        // 吸附线只挂载在`主动吸附`的组件，当前组件属于`被吸附`
        if (component.id === curComponentId) return;
        const componentStyle = getComponentRotatedStyle(component.style);
        const width = Number(componentStyle.width);
        const height = Number(componentStyle.height);
        const top = Number(componentStyle.top);
        const bottom = Number(componentStyle.bottom);
        const left = Number(componentStyle.left);
        const right = Number(componentStyle.right);
        const componentHalfWidth = width / 2;
        const componentHalfHeight = height / 2;

        const conditions = {
          top: [
            {
              line: 'xt',
              isNearly: decideIsNearly(curComponentTop, top),
              dragShift: top,
              lineShift: top
            },
            {
              isNearly: decideIsNearly(curComponentBottom, top),
              line: 'xt',
              dragShift: top - curComponentHeight,
              lineShift: top
            },
            {
              isNearly: decideIsNearly(
                curComponentTop + curComponentHalfHeight,
                top + componentHalfHeight
              ),
              line: 'xc',
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight
            },
            {
              isNearly: decideIsNearly(curComponentTop, bottom),
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom
            },
            {
              isNearly: decideIsNearly(curComponentBottom, bottom),
              line: 'xb',
              dragShift: bottom - curComponentHeight,
              lineShift: bottom
            }
          ],
          left: [
            {
              isNearly: decideIsNearly(curComponentLeft, left),
              line: 'yl',
              dragShift: left,
              lineShift: left
            },
            {
              isNearly: decideIsNearly(curComponentRight, left),
              line: 'yl',
              dragShift: left - curComponentWidth,
              lineShift: left
            },
            {
              isNearly: decideIsNearly(
                curComponentLeft + curComponentHalfWidth,
                left + componentHalfWidth
              ),
              line: 'yc',
              dragShift: left + componentHalfWidth - curComponentHalfWidth,
              lineShift: left + componentHalfWidth
            },
            {
              isNearly: decideIsNearly(curComponentLeft, right),
              line: 'yr',
              dragShift: right,
              lineShift: right
            },
            {
              isNearly: decideIsNearly(curComponentRight, right),
              line: 'yr',
              dragShift: right - curComponentWidth,
              lineShift: right
            }
          ]
        };

        // 生成新的吸附线坐标
        const newLineStyle = { ...lineStyle };
        // 生成新的吸附线展示状态
        const newLineStatus = { ...INIT_LINE_STATUS };
        forEach(conditions, (condition, key) => {
          forEach(condition, lineItem => {
            const { line, isNearly, dragShift, lineShift } = lineItem;

            if (!isNearly) return;

            Object.assign(newLineStatus, { [line]: isNearly });
            Object.assign(newLineStyle, {
              [line]: isNearly
                ? { ...newLineStyle[line as LineMap], [key]: lineShift }
                : {}
            });

            // console.log(key, line, dragShift, lineShift);

            componentDispatch({
              type: 'setCurComponentDragShift',
              payload: { [key]: dragShift }
            });
          });
        });

        setLineStyle(newLineStyle);
        onChooseTheTureLine(newLineStatus);
      });
    };

    useImperativeHandle(ref, () => ({
      showLine,
      hideLine: () => setLineStatus(INIT_LINE_STATUS)
    }));

    return (
      <div className={prefixCls}>
        {map(LINES_MAP, line => (
          <div
            key={line}
            className={`${prefixCls}-line ${
              includes(line, 'x') ? `${prefixCls}-xline` : `${prefixCls}-yline`
            }`}
            style={{
              display: lineStatus[line] ? 'block' : 'none',
              ...lineStyle[line]
            }}
          />
        ))}
      </div>
    );
  }
);

MarkLine.defaultProps = {
  prefixCls: 'visual-drag-mark'
};

export default MarkLine;
