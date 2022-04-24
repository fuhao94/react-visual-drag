/**
 * usePrevious
 * @Date:   2021-07-28 14:27
 */
import { useEffect, useRef } from 'react';
export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
