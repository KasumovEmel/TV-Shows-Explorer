import type { Show } from '@/app/show.types';


export interface FavoriteRemovalParams {
  button: HTMLButtonElement;
  update: () => Promise<void>;
}

export interface ToggleFavoriteParams {
  show: Show;
  animateRemoval?: (update: () => Promise<void>) => Promise<void>;
}

export interface FavoriteMutationParams {
  id: string;
  request: (id: string) => Promise<void>;
}

export type ReadFavorites = () => Promise<{ items: Show[] }>;
