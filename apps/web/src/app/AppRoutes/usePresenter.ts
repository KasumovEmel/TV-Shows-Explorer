import { useSyncExternalStore } from 'react';

import type { OnLocationChange } from './types';


function subscribe(update: OnLocationChange) {
  window.addEventListener('popstate', update);

  return () => window.removeEventListener('popstate', update);
}

const pathname = () => location.pathname;

export function usePresenter() {
  return { favorites: useSyncExternalStore(subscribe, pathname) === '/favorites' };
}
