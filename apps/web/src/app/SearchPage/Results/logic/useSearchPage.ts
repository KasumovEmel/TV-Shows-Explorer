import useSWR from 'swr';

import { loadSearchPage } from './tasks/loadSearchPage';
import { searchShows } from '@/api/generated/catalog';
import type { SearchPageRequest } from './types';


export function useSearchPage({ criteria, signal }: SearchPageRequest) {
  return useSWR(
    criteria && signal ? (['/api/shows', criteria] as const) : null,
    ([, params]) => loadSearchPage({ criteria: params, signal: signal!, requestPage: searchShows }),
    { shouldRetryOnError: false, isPaused: () => signal?.aborted === true },
  );
}
