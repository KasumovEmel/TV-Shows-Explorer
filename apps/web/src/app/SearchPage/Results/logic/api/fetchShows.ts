import { searchShows } from '@/api/generated/catalog';
import type { SearchCriteria } from '../../../logic/criteria';


export function fetchShows(criteria: SearchCriteria, signal: AbortSignal) {
  return searchShows(criteria, { signal });
}
