import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';


export function usePresenter() {
  const { t } = useTranslation();
  const favorites = location.pathname === '/favorites';
  const href = favorites ? '/' : '/favorites';

  function navigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  }

  return {
    label: t(favorites ? 'favorites.search' : 'favorites.title'),
    href,
    navigate,
    icon: favorites ? ('search' as const) : ('bookmark' as const),
  };
}
