import type { ReactNode } from 'react';

import type { SearchCriteria } from '@/app/pages/SearchPage/search';
import type { Show } from '@/app/types/show.types';


export interface SearchCardList {
  renderCard: (show: Show) => ReactNode;
  refreshFavorites: () => void;
}

export interface ResultsProps extends SearchCardList {
  search: { query: string; signal: AbortSignal } | null;
  criteria: SearchCriteria;
  isEntering: boolean;
  revision: number;
  selectGenre: (value: string) => void;
}

export type RetrySearch = () => void;
