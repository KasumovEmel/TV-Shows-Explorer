import type { Show } from '@/app/types/show.types';


export interface SearchResult {
  items: Show[];
  genres: string[];
  page: number;
  pageSize: number;
  totalBeforeFilter: number;
  totalAfterFilter: number;
}
