import { useEffect, useMemo, useState } from 'react';

import { loadSearchPage } from '../tasks/loadSearchPage';
import { searchShows } from '@/api/generated/catalog';
import { useRequestError } from '@/app/notifications';
import { runAbortableRequest } from '@/app/utils/runAbortableRequest';
import type { SearchPageRequest, SearchPageResponse } from '../types/SearchPageRequest';


export function useSearchPage({ criteria, signal }: SearchPageRequest) {
  const { q, genre, page } = criteria ?? {};
  const request = useMemo(
    () => (q && page && signal ? { criteria: { q, genre, page }, signal } : undefined),
    [q, genre, page, signal],
  );
  const [response, setResponse] = useState<SearchPageResponse>();
  const [attempt, setAttempt] = useState(0);
  const onError = useRequestError();

  useEffect(() => {
    if (!request) {
      return;
    }

    return runAbortableRequest({
      parentSignal: request.signal,
      run: (signal) =>
        loadSearchPage({ criteria: request.criteria, signal, requestPage: searchShows }),
      onSuccess: ({ data }) => setResponse({ request, data }),
      onError: (error) => {
        setResponse({ request, error });
        onError(error);
      },
    }).abort;
  }, [request, attempt, onError]);

  function retry() {
    setResponse(undefined);
    setAttempt((n) => n + 1);
  }

  const current = response?.request === request ? response : undefined;

  return { data: current?.data, isFailed: current?.error !== undefined, retry };
}
