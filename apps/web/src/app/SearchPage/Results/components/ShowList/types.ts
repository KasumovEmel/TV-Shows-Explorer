import type { ReactNode } from 'react';

import type { SearchCriteria, SearchResult } from '@/app/SearchPage/search';


export interface ShowListProps {
  first?: SearchResult;
  criteria: SearchCriteria;
  signal?: AbortSignal;
  isLoading: boolean;
  renderPageError: (retry: () => void) => ReactNode;
}
