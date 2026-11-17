import type { SearchCriteria } from '../../logic/criteria.types';
import type { searchShows } from '@/api/generated/catalog';


export interface LoadSearchPageParams {
  criteria: SearchCriteria;
  signal: AbortSignal;
  requestPage: typeof searchShows;
}

export interface SearchPageRequest {
  criteria: SearchCriteria | null;
  signal?: AbortSignal;
}
