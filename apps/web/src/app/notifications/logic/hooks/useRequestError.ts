import { useCallback } from 'react';

import { isAxiosError } from 'axios';

import { useNotify } from './useNotify';


export function useRequestError() {
  const notify = useNotify();

  return useCallback(
    (error: unknown) => {
      const cause = error instanceof Error ? (error.cause ?? error) : error;
      if (isAxiosError(cause) && cause.code === 'ERR_CANCELED') {
        return;
      }
      if (isAxiosError(cause) && cause.response?.status === 429) {
        notify({ kind: 'warning', messageKey: 'notification.warning.rateLimit' });

        return;
      }
      notify({ kind: 'error', messageKey: 'notification.error.requestFailed' });
    },
    [notify],
  );
}
