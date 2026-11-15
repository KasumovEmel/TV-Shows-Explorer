import { useState } from 'react';

import { useSearchPage } from '../../../logic/useSearchPage';
import type { SearchResult } from '../../../logic/searchResult';
import type { PagedResultsProps } from '../../types';


export function useMorePages({ first, criteria, signal, loading }: PagedResultsProps) {
  const [target, open] = useState(1);
  const [extra, setExtra] = useState<SearchResult[]>([]);
  const total = loading ? 0 : (first?.totalAfterFilter ?? 0);
  const pages = first ? Math.ceil(total / first.pageSize) : 0;
  const next = 2 + extra.length;
  const { data, error, mutate } = useSearchPage(
    next <= Math.min(target, pages) ? { ...criteria, page: next } : null,
    signal,
  );

  if (data?.page === next) {
    setExtra([...extra, data]);
  }
  const groups = first && !loading ? [first, ...extra].slice(0, pages) : [];

  return { groups, total, pages, open, failed: Boolean(error), retry: () => void mutate() };
}
