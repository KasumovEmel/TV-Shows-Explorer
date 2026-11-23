import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';
import type { TvMazeClient } from './logic/api/TvMazeClient';


export type CatalogSource = Pick<TvMazeClient, 'byId' | 'search'>;

export interface ShowCatalogOptions {
  api?: CatalogSource;
  now?: Clock;
  storage?: CatalogStorage;
}

export interface CacheEntry<T> {
  value: T;
  expires: number;
}

export type CacheEntries<T> = Record<string, CacheEntry<T>>;

export interface CatalogStorage {
  searches?: CacheEntries<Show[]>;
  shows?: CacheEntries<Show>;
}

export interface CatalogCacheOptions<T> {
  entries: CacheEntries<T>;
  now: Clock;
}

export interface CacheWrite<T> {
  key: string;
  value: T;
}

export interface CacheLookup<T> {
  key: string;
  load: () => Promise<T>;
}
