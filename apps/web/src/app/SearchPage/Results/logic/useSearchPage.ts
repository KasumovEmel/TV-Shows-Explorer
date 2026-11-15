import useSWR from 'swr';

import { fetchShows } from './api/fetchShows';
import { searchShows } from './tasks/searchShows';
import type { SearchCriteria } from '../../logic/criteria';


export function useSearchPage(criteria: SearchCriteria | null, signal?: AbortSignal) {
  return useSWR(
    criteria && signal ? (['/api/shows', criteria] as const) : null,
    ([, params]) => searchShows(params, signal!, fetchShows),
    { shouldRetryOnError: false, isPaused: () => signal?.aborted === true },
  );
}
