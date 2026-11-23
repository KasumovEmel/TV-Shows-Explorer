import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';


export interface FavoritesStoreOptions {
  storage?: FavoriteStorage;
  sessions?: SessionStorage;
  now?: Clock;
}

export interface StoredSession {
  expires: number;
  email: string;
}

export type SessionStorage = Record<string, StoredSession>;

export type FavoriteStorage = Record<string, Show[]>;

export interface FavoriteKey {
  session: string;
  id: string;
}

export interface FavoriteSnapshot {
  session: string;
  show: Show;
}
