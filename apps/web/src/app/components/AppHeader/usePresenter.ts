import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';


export function usePresenter(favoritesPage: boolean) {
  const { t } = useTranslation();

  function navigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    const destination = e.currentTarget.href;
    if (destination === location.href) {
      window.scrollTo(0, 0);

      return;
    }

    function changePage() {
      history.pushState(null, '', destination);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }

    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(changePage);
    } else {
      changePage();
    }
  }

  return {
    label: t(favoritesPage ? 'favorites.search' : 'favorites.title'),
    href: favoritesPage ? '/' : '/favorites',
    navigate,
    icon: favoritesPage ? ('search' as const) : ('heart' as const),
  };
}
