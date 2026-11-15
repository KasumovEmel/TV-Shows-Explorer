import type { SearchCriteria } from '../../../logic/criteria';
import type { SearchResult } from '../searchResult';


export function searchShows(
  criteria: SearchCriteria,
  signal: AbortSignal,
  load: (criteria: SearchCriteria, signal: AbortSignal) => Promise<SearchResult>,
) {
  return load(criteria, signal);
}
