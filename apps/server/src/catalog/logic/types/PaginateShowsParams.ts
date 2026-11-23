import type { Show } from '../../../generated/routes.schemas';


export interface PaginateShowsParams {
  shows: Show[];
  genre: string | undefined;
  page: number;
}
