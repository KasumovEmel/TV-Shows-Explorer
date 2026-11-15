import type { SearchCriteria } from '../criteria';


export function selectGenre(criteria: SearchCriteria, genre: string): SearchCriteria {
  return { ...criteria, genre: genre || undefined, page: 1 };
}
