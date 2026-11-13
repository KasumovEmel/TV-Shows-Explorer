import { request } from '@/app/utils/request';

import type { TVmazeShow } from './types';


export const showsSearchUrl = 'https://api.tvmaze.com/search/shows';

export function fetchShows(query: string) {
  return request<{ show: TVmazeShow }[]>({
    url: showsSearchUrl,
    params: { q: query },
  });
}
