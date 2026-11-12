import axios from 'axios';

import { normalizeShow } from '../helpers/normalizeShow';

import type { TVmazeShow } from '../types';


export async function fetchShows([url, q]: readonly [string, string]) {
  const { data } = await axios.get<{ show: TVmazeShow }[]>(url, { params: { q }, timeout: 10000 });
  return data.map(({ show }) => normalizeShow(show));
}
