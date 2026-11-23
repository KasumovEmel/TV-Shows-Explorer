import { useCallback, useEffect, useRef, useState } from 'react';

import { isAxiosError } from 'axios';

import * as api from '@/api/generated/catalog';
import { useRequestError } from '@/app/notifications';
import { navigateTo } from '@/app/utils/navigateTo';
import type { UserSession } from '../types';


export function useAuth() {
  const [session, setSession] = useState<UserSession | null>();
  const [isPending, setPending] = useState(false);
  const operation = useRef<AbortController | null>(null);
  const current = useRef<UserSession | null>(null);
  const onError = useRequestError();

  const accept = useCallback((email: string | null) => {
    current.current?.scope.abort();
    current.current = email ? { email, scope: new AbortController() } : null;
    setSession(current.current);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    operation.current = controller;
    void api
      .getSession({ signal: controller.signal })
      .then(({ email }) => {
        if (!controller.signal.aborted) {
          accept(email);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          accept(null);
          onError(error);
        }
      });

    return () => {
      operation.current?.abort();
      current.current?.scope.abort();
    };
  }, [accept, onError]);

  async function change(email?: string) {
    if (isPending) {
      return;
    }
    operation.current?.abort();
    const controller = new AbortController();
    operation.current = controller;
    setPending(true);
    try {
      let next = null;
      if (email !== undefined) {
        next = (await api.login({ email }, { signal: controller.signal })).email;
      } else {
        await api.logout({ signal: controller.signal });
      }
      if (controller.signal.aborted) {
        return;
      }
      const nextEmail = next;
      navigateTo({
        path: '/',
        replace: true,
        onNavigate: () => {
          if (!controller.signal.aborted) {
            accept(nextEmail);
            setPending(false);
          }
        },
      });
    } catch (error) {
      if (!controller.signal.aborted) {
        onError(error);
        setPending(false);
      }
    }
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
    login: (email: string) => void change(email),
    logout: () => void change(),
    onFavoriteError,
  };
}
