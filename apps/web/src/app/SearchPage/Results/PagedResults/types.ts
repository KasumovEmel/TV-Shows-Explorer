import type { SearchCriteria } from '../../logic/criteria';
import type { SearchResult } from '../logic/searchResult';


export interface PagedResultsProps {
  first?: SearchResult;
  criteria: SearchCriteria;
  signal?: AbortSignal;
  loading: boolean;
}
