import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';
import type { FavoritesStore } from './FavoritesStore';


export interface FavoritesStoreOptions {
  path: string;
  now?: Clock;
}

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

export interface SaveFavoriteParams {
  store: Pick<FavoritesStore, 'has' | 'insert'>;
  session: string;
  id: string;
  loadShow: (id: string) => Promise<Show>;
}
