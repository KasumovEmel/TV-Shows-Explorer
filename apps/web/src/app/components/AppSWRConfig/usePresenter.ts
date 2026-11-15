import { useMemo } from 'react';

import { useRequestError } from '../../notifications';


export function usePresenter() {
  const onError = useRequestError();

  return useMemo(() => ({ provider: () => new Map(), onError }), [onError]);
}
