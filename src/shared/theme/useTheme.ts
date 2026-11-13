import { useEffect, useLayoutEffect, useState } from 'react';


type Theme = 'light' | 'dark';
const storageKey = 'tv-shows-explorer.theme';
const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

function readPreference(): Theme | null {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

export function useTheme() {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(() => systemPreference.matches);
  const theme = preference ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    const update = () => setSystemDark(systemPreference.matches);
    systemPreference.addEventListener('change', update);
    update();
    return () => systemPreference.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),
      );
  }, [theme]);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setPreference(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Keep the choice for this visit if browser storage is unavailable.
    }
  }

  return { theme, toggle };
}
