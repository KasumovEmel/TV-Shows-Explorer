import { useCallback, useEffect, useRef } from 'react';


export function useAbortScope() {
  const controller = useRef<AbortController | null>(null);

  const getSignal = useCallback(() => {
    controller.current ??= new AbortController();

    return controller.current.signal;
  }, []);

  const abort = useCallback(() => {
    const active = controller.current;
    controller.current = null;
    active?.abort();
  }, []);

  const renew = useCallback(() => {
    abort();

    return getSignal();
  }, [abort, getSignal]);

  useEffect(() => abort, [abort]);

  return { getSignal, renew, abort };
}
