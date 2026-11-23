import type { SearchCriteria } from './SearchCriteria';
import type { SearchResult } from './SearchResult';
import type { searchShows } from '@/api/generated/catalog';


export interface LoadSearchPageParams {
  criteria: SearchCriteria;
  signal: AbortSignal;
  requestPage: typeof searchShows;
}

export interface SearchPageRequest {
  criteria: SearchCriteria | null;
  signal?: AbortSignal;
  onCards?: () => void;
}

export interface SearchPageResponse {
  request: SearchPageRequest;
  data?: SearchResult;
  error?: unknown;
}
