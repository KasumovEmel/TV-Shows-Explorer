import type { Show } from '@/app/show';


export interface SearchResult {
  items: Show[];
  genres: string[];
  page: number;
  pageSize: number;
  totalBeforeFilter: number;
  totalAfterFilter: number;
}
