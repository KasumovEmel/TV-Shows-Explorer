import { z } from 'zod';

import { ApiFailure } from '../../../errors';
import { normalizeShow } from '../helpers/normalizeShow';
import { tvShow } from './tvShow';
import type { TvMazeClientOptions, TvMazeRequest } from '../types/TvMazeRequest';


const hits = z.array(z.object({ show: tvShow }));

export class TvMazeClient {
  private transport: typeof fetch;
  private timeout: number;

  constructor({ transport = fetch, timeout = 8000 }: TvMazeClientOptions = {}) {
    this.transport = transport;
    this.timeout = timeout;
  }

  private async read<T>({ path, schema, isLookupById = false }: TvMazeRequest<T>) {
    const signal = AbortSignal.timeout(this.timeout);
    try {
      const res = await this.transport('https://api.tvmaze.com' + path, { signal });
      if (res.status === 429) {
        throw new ApiFailure({
          status: 429,
          code: 'rate_limit',
          message: 'Catalog rate limit reached',
          retryAfter: res.headers.get('retry-after'),
        });
      }
      if (isLookupById && res.status === 404) {
        throw new ApiFailure({ status: 404, code: 'show_not_found', message: 'Show not found' });
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
        throw new ApiFailure({
          status: 504,
          code: 'catalog_timeout',
          message: 'Catalog timed out',
        });
      }
      console.error('TVmaze request failed', error instanceof Error ? error.name : 'request');
      throw new ApiFailure({
        status: 502,
        code: 'catalog_unavailable',
        message: 'Catalog unavailable',
      });
    }
  }

  async byId(id: string) {
    const show = await this.read({
      path: '/shows/' + encodeURIComponent(id),
      schema: tvShow,
      isLookupById: true,
    });
    if (String(show.id) !== id) {
      throw new ApiFailure({
        status: 502,
        code: 'invalid_show',
        message: 'Invalid catalog response',
      });
    }

    return normalizeShow(show);
  }

  async search(title: string) {
    const records = await this.read({
      path: '/search/shows?' + new URLSearchParams({ q: title }),
      schema: hits,
    });

    return records.map(({ show }) => normalizeShow(show));
  }
}
