import type { SearchCriteria } from './logic/criteria.types';


export interface SearchPageProps {
  restored: boolean;
}

export interface SearchFilter {
  genre?: string;
  page: number;
  revision: number;
}

export interface SearchTransitionParams {
  docked: boolean;
  finishEntrance: () => void;
}

export type SearchPhase = 'idle' | 'entering' | 'docked';

export interface SelectGenreParams {
  criteria: SearchCriteria;
  genre: string;
}
