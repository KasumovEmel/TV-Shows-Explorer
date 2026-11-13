import { normalizeShow } from '../helpers/normalizeShow';
import { request } from '@shared/utils/request';

import type { TVmazeShow } from './types';


export const showsSearchUrl = 'https://api.tvmaze.com/search/shows';

export async function fetchShows([url, q]: readonly [string, string]) {
  const data = await request<{ show: TVmazeShow }[]>({ url, params: { q } });

  return data.map(({ show }) => normalizeShow(show));
}
