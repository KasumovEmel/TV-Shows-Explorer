import type { SearchCriteria } from '../logic/criteria.types';


export interface ResultsProps {
  search: { query: string; signal: AbortSignal } | null;
  criteria: SearchCriteria;
  entering: boolean;
  revision: number;
  selectGenre: (value: string) => void;
}

export type RetrySearch = () => void;
