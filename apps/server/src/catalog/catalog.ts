import { z } from 'zod';

import { ApiFailure } from '../errors';
import { CatalogCache } from './cache';
import { normalizeShow, tvShow } from './normalizeShow';
import type { SearchPage, SearchShowsParams, Show } from '../generated/routes.schemas';


const hits = z.array(z.object({ show: tvShow }));
export class Catalog {
  private searches: CatalogCache<Show[]>;
  private shows: CatalogCache<Show>;

  constructor(
    private transport = fetch,
    now = Date.now,
    private timeout = 8000,
  ) {
    this.searches = new CatalogCache(now);
    this.shows = new CatalogCache(now);
  }

  prune() {
    this.searches.prune();
    this.shows.prune();
  }

  private async read<T>(path: string, schema: z.ZodType<T>, byId = false) {
    const signal = AbortSignal.timeout(this.timeout);
    try {
      const res = await this.transport('https://api.tvmaze.com' + path, { signal });
      if (res.status === 429) {
        throw new ApiFailure(
          429,
          'rate_limit',
          'Catalog rate limit reached',
          res.headers.get('retry-after'),
        );
      }
      if (byId && res.status === 404) {
        throw new ApiFailure(404, 'show_not_found', 'Show not found');
      }
      if (!res.ok) {
        throw new Error('TVmaze HTTP ' + res.status);
      }

      return schema.parse(await res.json());
    } catch (error) {
      if (error instanceof ApiFailure) {
        throw error;
      }
      if (signal.aborted) {
        throw new ApiFailure(504, 'catalog_timeout', 'Catalog timed out');
      }
      console.error('TVmaze request failed', error instanceof Error ? error.name : 'request');
      throw new ApiFailure(502, 'catalog_unavailable', 'Catalog unavailable');
    }
  }

  byId(id: string) {
    return this.shows.get(id, async () => {
      const show = await this.read('/shows/' + encodeURIComponent(id), tvShow, true);
      if (String(show.id) !== id) {
        throw new ApiFailure(502, 'invalid_show', 'Invalid catalog response');
      }

      return normalizeShow(show);
    });
  }

  async search({ q, genre, page = 1 }: SearchShowsParams): Promise<SearchPage> {
    const title = q.trim();
    const all = await this.searches.get(title, async () => {
      const records = await this.read('/search/shows?' + new URLSearchParams({ q: title }), hits);

      return records.map(({ show }) => {
        const card = normalizeShow(show);
        this.shows.store(card.id, card);

        return card;
      });
    });
    const genres = [...new Set(all.flatMap((show) => show.genres))];
    const filtered = genre ? all.filter((show) => show.genres.includes(genre)) : all;

    return {
      items: filtered.slice((page - 1) * 3, page * 3),
      genres,
      page,
      pageSize: 3,
      totalBeforeFilter: all.length,
      totalAfterFilter: filtered.length,
    };
  }
}
