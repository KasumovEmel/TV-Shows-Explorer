import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';


export interface FavoritesStoreOptions {
  storage?: FavoriteStorage;
  now?: Clock;
}

export interface StoredSession {
  expires: number;
  shows: Show[];
}

export type FavoriteStorage = Record<string, StoredSession>;

export interface FavoriteSession {
  id: string;
  token?: string;
}

export interface FavoriteKey {
  session: string;
  id: string;
}

export interface FavoriteSnapshot {
  session: string;
  show: Show;
}
