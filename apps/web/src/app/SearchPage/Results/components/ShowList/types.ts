import type { ReactNode, RefObject } from 'react';

import type { SearchCriteria } from '../../../logic/criteria.types';
import type { SearchResult } from '../../logic/searchResult.types';


export interface ShowListProps {
  first?: SearchResult;
  criteria: SearchCriteria;
  signal?: AbortSignal;
  loading: boolean;
  renderPageError: (retry: () => void) => ReactNode;
}

export interface PageJump {
  page: number;
  keyboard: boolean;
}

export interface PageViewportParams {
  list: RefObject<HTMLDivElement | null>;
  bar: RefObject<HTMLDivElement | null>;
  opened: number;
  pages: number;
  select: (page: number) => void;
}

export interface PageScrollParams {
  list: RefObject<HTMLDivElement | null>;
  jumpY: RefObject<number | null>;
  opened: number;
  pages: number;
  open: (page: number) => void;
}
