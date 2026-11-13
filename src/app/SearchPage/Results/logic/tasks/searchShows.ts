import { fetchShows } from '../api/fetchShows';
import { normalizeShow } from '../helpers/normalizeShow';
import { readSummaryText } from '../readSummaryText';
import type { Show } from '../show';


export async function searchShows(query: string, signal: AbortSignal): Promise<Show[]> {
  const hits = await fetchShows(query, signal);

  return hits.map(({ show }) => normalizeShow(show, readSummaryText(show.summary)));
}
