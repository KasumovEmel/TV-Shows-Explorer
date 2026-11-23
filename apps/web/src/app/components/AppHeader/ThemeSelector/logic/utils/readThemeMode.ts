import type { ThemeMode } from '../../types';


export function readThemeMode(): ThemeMode {
  const mode = document.documentElement.dataset.theme;

  return mode === 'dark' || mode === 'light' ? mode : 'system';
}
