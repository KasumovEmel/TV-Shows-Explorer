import type { z } from 'zod';

import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';
import type { TvMazeClient } from './logic/api/TvMazeClient';


export type CatalogSource = Pick<TvMazeClient, 'byId' | 'search'>;

export interface ShowCatalogOptions {
  api?: CatalogSource;
  now?: Clock;
}

export interface CacheEntry<T> {
  value: T;
  expires: number;
}

export interface CacheWrite<T> {
  key: string;
  value: T;
}

export interface CacheLookup<T> {
  key: string;
  load: () => Promise<T>;
}

export interface PaginateShowsParams {
  shows: Show[];
  genre: string | undefined;
  page: number;
}

export interface TvMazeClientOptions {
  transport?: typeof globalThis.fetch;
  timeout?: number;
}

export interface TvMazeRequest<T> {
  path: string;
  schema: z.ZodType<T>;
  byId?: boolean;
}
