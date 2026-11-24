import { useCallback, useEffect, useRef, useState } from 'react';

import { isAxiosError } from 'axios';

import * as api from '@/api/generated/catalog';
import { useAbortScope } from '@/app/logic/hooks/useAbortScope';
import { useRequestError } from '@/app/notifications';
import { navigateTo } from '@/app/utils/navigateTo';
import { runAbortableRequest } from '@/app/utils/runAbortableRequest';
import type { UserSession } from '../types';
import type { AbortRequest } from '@/app/types/request.types';


export function useAuth() {
  const [session, setSession] = useState<UserSession | null>();
  const [isPending, setPending] = useState(false);
  const abortOperation = useRef<AbortRequest | null>(null);
  const { renew, abort } = useAbortScope();
  const onError = useRequestError();

  const accept = useCallback(
    (email: string | null) => {
      if (email) {
        setSession({ email, signal: renew() });
      } else {
        abort();
        setSession(null);
      }
    },
    [renew, abort],
  );

  useEffect(() => {
    abortOperation.current = runAbortableRequest({
      run: (signal) => api.getSession({ signal }),
      onSuccess: ({ data }) => accept(data.email),
      onError: (error) => {
        accept(null);
        onError(error);
      },
    }).abort;

    return () => abortOperation.current?.();
  }, [accept, onError]);

  function change(email?: string) {
    if (isPending) {
      return;
    }
    abortOperation.current?.();
    setPending(true);
    abortOperation.current = runAbortableRequest({
      run: async (signal) => {
        if (email !== undefined) {
          return (await api.login({ email }, { signal })).email;
        }
        await api.logout({ signal });

        return null;
      },
      onSuccess: ({ data, signal }) => {
        navigateTo({
          path: '/',
          replace: true,
          onNavigate: () => {
            if (!signal.aborted) {
              accept(data);
              setPending(false);
            }
          },
        });
      },
      onError: (error) => {
        onError(error);
        setPending(false);
      },
    }).abort;
  }

  const onFavoriteError = useCallback(
    (error: unknown) => {
      const cause = error instanceof Error ? error.cause : error;
      if (isAxiosError(cause) && cause.response?.status === 401) {
        accept(null);
      } else {
        onError(error);
      }
    },
    [accept, onError],
  );

  return {
    session,
    isPending,
    login: (email: string) => change(email),
    logout: () => change(),
    onFavoriteError,
  };
}
