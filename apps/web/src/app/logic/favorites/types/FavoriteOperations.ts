import type { Show } from '@/app/types/show.types';


export interface FavoriteMutationParams {
  id: string;
  request: (id: string) => Promise<void>;
}

export interface RemoveFavoriteParams {
  id: string;
  request: (id: string) => Promise<{ items: Show[] }>;
}

export type FavoriteSnapshot = number | Show[];

export type UpdateFavorites = (items: Show[]) => Show[];

export type CommitFavorites = (update: UpdateFavorites) => void;

export type ReadFavorites = () => Promise<{ items: Show[] }>;

export interface FavoriteAccess {
  signal?: AbortSignal;
  onError: (error: unknown) => void;
}

export interface FavoriteChanges extends FavoriteAccess {
  commit: CommitFavorites;
}
