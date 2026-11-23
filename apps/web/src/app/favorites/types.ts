import type { Dispatch, SetStateAction } from 'react';

import type { Show } from '@/app/show.types';


export interface FavoriteRemovalParams {
  button: HTMLButtonElement;
  update: () => Promise<void>;
}

export interface FavoritesState {
  items?: Show[];
  setItems: Dispatch<SetStateAction<Show[] | undefined>>;
  count?: number;
  isFailed: boolean;
  requestList: () => void;
  retry: () => void;
}
