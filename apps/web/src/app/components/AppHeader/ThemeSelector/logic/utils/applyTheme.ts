import type { ThemeMode } from '../../types';


const darkToolbarMedia = { system: '(prefers-color-scheme: dark)', dark: 'all', light: 'not all' };

export function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  document
    .querySelector('meta[name="theme-color"][media]')
    ?.setAttribute('media', darkToolbarMedia[mode]);
  try {
    localStorage.setItem('tv-shows-explorer.theme', mode);
  } catch {
    // The document keeps the selected mode for this visit.
  }
}
