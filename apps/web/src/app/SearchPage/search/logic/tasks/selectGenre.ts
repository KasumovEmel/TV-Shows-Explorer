import type { SearchCriteria, SelectGenreParams } from '../types/SearchCriteria';


export function selectGenre({ criteria, genre }: SelectGenreParams): SearchCriteria {
  return { ...criteria, genre: genre || undefined, page: 1 };
}
