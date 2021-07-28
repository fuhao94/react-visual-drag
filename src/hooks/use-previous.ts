/**
 * usePrevious
 * @Date:   2021-07-28 14:27
 * @Author: zhangfuhao@mininglamp.com
 */
import { useEffect, useRef } from 'react';
export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
