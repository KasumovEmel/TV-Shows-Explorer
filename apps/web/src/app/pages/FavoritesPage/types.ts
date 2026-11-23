import type { PageFavorites } from '@/app/logic/favorites';
import type { Show } from '@/app/types/show.types';


export interface FavoritesPageProps {
  favorites: PageFavorites;
}

export interface RemovingRow {
  show: Show;
  following: Set<string>;
}

export interface FavoriteRemovalParams {
  button: HTMLButtonElement;
  update: () => void;
}
