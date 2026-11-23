import { useState } from 'react';

import { useSearchPage } from '@/app/pages/SearchPage/search';
import type { ShowListProps } from '../../types';
import type { SearchResult } from '@/app/pages/SearchPage/search';


export function useMorePages({ first, criteria, signal, isLoading }: ShowListProps) {
  const [target, open] = useState(1);
  const [extra, setExtra] = useState<SearchResult[]>([]);
  const total = isLoading ? 0 : (first?.totalAfterFilter ?? 0);
  const pages = first ? Math.ceil(total / first.pageSize) : 0;
  const next = 2 + extra.length;
  const { data, isFailed, retry } = useSearchPage({
    criteria: next <= Math.min(target, pages) ? { ...criteria, page: next } : null,
    signal,
  });

  if (data?.page === next) {
    setExtra([...extra, data]);
  }
  const groups = first && !isLoading ? [first, ...extra].slice(0, pages) : [];

  return { groups, total, pages, open, isFailed, retry };
}
