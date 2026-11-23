import { useSyncExternalStore } from 'react';

import { useFavoriteChanges, useFavoriteList } from '../logic/favorites';
import type { OnLocationChange } from './types';


function subscribe(update: OnLocationChange) {
  window.addEventListener('popstate', update);

  return () => window.removeEventListener('popstate', update);
}

const pathname = () => location.pathname;

export function usePresenter() {
  const isFavoritesPage = useSyncExternalStore(subscribe, pathname) === '/favorites';
  const { commit, ...list } = useFavoriteList(isFavoritesPage);
  const setSaved = useFavoriteChanges(commit);

  return { isFavoritesPage, favorites: { ...list, setSaved } };
}
