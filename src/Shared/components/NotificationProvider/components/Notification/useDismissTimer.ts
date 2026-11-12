import { useEffect, useRef } from 'react';


export function useDismissTimer(
  auto: boolean,
  paused: boolean,
  id: number,
  dismiss: (id: number) => void,
) {
  const remaining = useRef(6000);
  useEffect(() => {
    if (!auto || paused) return;
    const start = performance.now();
    const timer = window.setTimeout(() => dismiss(id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [auto, paused, id, dismiss]);
}
