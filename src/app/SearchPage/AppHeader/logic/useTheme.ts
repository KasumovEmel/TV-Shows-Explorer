import { useState } from 'react';


type ThemeMode = 'system' | 'dark' | 'light';

const nextMode: Record<ThemeMode, ThemeMode> = { system: 'dark', dark: 'light', light: 'system' };
const darkToolbarMedia = { system: '(prefers-color-scheme: dark)', dark: 'all', light: 'not all' };

function readMode(): ThemeMode {
  const mode = document.documentElement.dataset.theme;

  return mode === 'dark' || mode === 'light' ? mode : 'system';
}

export function useTheme() {
  const [mode, setMode] = useState(readMode);

  function onToggleTheme() {
    const next = nextMode[mode];
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"][media]')
      ?.setAttribute('media', darkToolbarMedia[next]);
    setMode(next);
    try {
      localStorage.setItem('tv-shows-explorer.theme', next);
    } catch {
      // The document keeps the selected mode for this visit.
    }
  }

  return { mode, onToggleTheme };
}
