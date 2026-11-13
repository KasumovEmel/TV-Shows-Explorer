import { useMemo } from 'react';

import { isAxiosError } from 'axios';

import { useNotify } from '../../notifications';


export function usePresenter() {
  const notify = useNotify();

  return useMemo(
    () => ({
      provider: () => new Map(),
      onError(error: unknown) {
        const cause = error instanceof Error ? (error.cause ?? error) : error;
        if (isAxiosError(cause) && cause.response?.status === 429) {
          notify({ kind: 'warning', messageKey: 'notification.warning.rateLimit' });

          return;
        }
        notify({ kind: 'error', messageKey: 'notification.error.requestFailed' });
      },
    }),
    [notify],
  );
}
