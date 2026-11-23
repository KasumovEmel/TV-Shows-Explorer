import { useContext } from 'react';

import { FavoritesContext } from '../../context';


export function useFavoritesState() {
  const state = useContext(FavoritesContext);
  if (!state) {
    throw new Error('FavoritesProvider is missing');
  }

  return state;
}
