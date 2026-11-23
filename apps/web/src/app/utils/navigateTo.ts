import type { Navigation } from '../types/navigation.types';


export function navigateTo({ path, replace = false, onNavigate }: Navigation) {
  function changePage() {
    onNavigate?.();
    if (location.pathname !== path) {
      if (replace) {
        history.replaceState(null, '', path);
      } else {
        history.pushState(null, '', path);
      }
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo(0, 0);
  }

  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(changePage);
  } else {
    changePage();
  }
}
