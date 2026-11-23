import type { Show } from '@/app/types/show.types';


export interface SaveSelection {
  show: Show;
  isSaved: boolean;
}

export interface PageFavorites {
  items?: Show[];
  count?: number;
  isLoading: boolean;
  isFailed: boolean;
  refresh: () => void;
  setSaved: (selection: SaveSelection) => Promise<boolean>;
}
