import { useEffect, useRef } from 'react';

import { dismissAfterMs } from '@/styles/tokens';


export function useDismissTimer(paused: boolean, id: number, expire: (id: number) => void) {
  const remaining = useRef(dismissAfterMs);

  useEffect(() => {
    remaining.current = dismissAfterMs;
  }, [id]);

  useEffect(() => {
    if (paused) {
      return;
    }
    const start = performance.now();
    const timer = window.setTimeout(() => expire(id), remaining.current);

    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [paused, id, expire]);
}
