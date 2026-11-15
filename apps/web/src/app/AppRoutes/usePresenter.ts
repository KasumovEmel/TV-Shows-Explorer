import { useSyncExternalStore } from 'react';


function subscribe(update: () => void) {
  window.addEventListener('popstate', update);

  return () => window.removeEventListener('popstate', update);
}

const pathname = () => location.pathname;

export function usePresenter() {
  return { favorites: useSyncExternalStore(subscribe, pathname) === '/favorites' };
}
