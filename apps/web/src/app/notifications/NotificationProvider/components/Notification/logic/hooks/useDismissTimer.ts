import { useEffect, useRef } from 'react';

import { dismissAfterMs } from '@/styles/tokens';
import type { DismissTimerParams } from '../types/NotificationPresentation';


export function useDismissTimer({ isPaused, id, expire }: DismissTimerParams) {
  const remaining = useRef(dismissAfterMs);

  useEffect(() => {
    remaining.current = dismissAfterMs;
  }, [id]);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const start = performance.now();
    const timer = window.setTimeout(() => expire(id), remaining.current);

    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [isPaused, id, expire]);
}
