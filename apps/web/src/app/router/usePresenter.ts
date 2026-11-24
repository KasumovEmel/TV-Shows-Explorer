import { useEffect, useSyncExternalStore } from 'react';

import { useAuth } from '../logic/auth';
import { useFavoriteChanges, useFavoriteList } from '../logic/favorites';
import { navigateTo } from '../utils/navigateTo';
import type { OnLocationChange } from './types';


function subscribe(update: OnLocationChange) {
  window.addEventListener('popstate', update);

  return () => window.removeEventListener('popstate', update);
}

const pathname = () => location.pathname;

export function usePresenter() {
  const path = useSyncExternalStore(subscribe, pathname);
  const { session, isPending, login, logout, onFavoriteError } = useAuth();
  const access = { signal: session?.signal, onError: onFavoriteError };
  const { commit, ...list } = useFavoriteList(access);
  const setSaved = useFavoriteChanges({ ...access, commit });

  useEffect(() => {
    if (path === '/favorites' && session === null) {
      navigateTo({ path: '/login', replace: true });
    } else if (path === '/login' && session) {
      navigateTo({ path: '/', replace: true });
    }
  }, [path, session]);

  return {
    isSearchPage: path !== '/favorites' && path !== '/login',
    isLoginPage: path === '/login',
    isFavoritesPage: path === '/favorites' && !!session,
    account: { email: session === null ? null : session?.email, isPending, logout },
    login,
    favorites: { ...list, setSaved },
  };
}
