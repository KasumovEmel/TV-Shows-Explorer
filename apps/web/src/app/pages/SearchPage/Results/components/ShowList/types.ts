import type { ReactNode } from 'react';

import type { SearchCardList } from '../../types';
import type { SearchCriteria, SearchResult } from '@/app/pages/SearchPage/search';


export interface ShowListProps extends SearchCardList {
  first?: SearchResult;
  criteria: SearchCriteria;
  signal?: AbortSignal;
  isLoading: boolean;
  renderPageError: (retry: () => void) => ReactNode;
}
