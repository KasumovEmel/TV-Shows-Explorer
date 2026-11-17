import type { SelectGenreParams } from '../../types';
import type { SearchCriteria } from '../criteria.types';


export function selectGenre({ criteria, genre }: SelectGenreParams): SearchCriteria {
  return { ...criteria, genre: genre || undefined, page: 1 };
}
