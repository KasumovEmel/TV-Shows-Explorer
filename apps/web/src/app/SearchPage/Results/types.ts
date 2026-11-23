import type { SearchCriteria } from '@/app/SearchPage/search';


export interface ResultsProps {
  search: { query: string; signal: AbortSignal } | null;
  criteria: SearchCriteria;
  isEntering: boolean;
  revision: number;
  selectGenre: (value: string) => void;
}

export type RetrySearch = () => void;
