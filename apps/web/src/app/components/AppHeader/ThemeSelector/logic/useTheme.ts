import { useState } from 'react';

import { cycleTheme } from './cycleTheme';
import type { ThemeMode } from '../types';


const darkToolbarMedia = { system: '(prefers-color-scheme: dark)', dark: 'all', light: 'not all' };

function readMode(): ThemeMode {
  const mode = document.documentElement.dataset.theme;

  return mode === 'dark' || mode === 'light' ? mode : 'system';
}

export function useTheme() {
  const [mode, setMode] = useState(readMode);

  function onToggleTheme() {
    const next = cycleTheme(mode);
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
