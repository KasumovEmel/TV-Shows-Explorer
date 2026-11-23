import { useState } from 'react';

import { cycleTheme } from '../helpers/cycleTheme';
import { applyTheme } from '../utils/applyTheme';
import { readThemeMode } from '../utils/readThemeMode';


export function useTheme() {
  const [mode, setMode] = useState(readThemeMode);

  function onToggleTheme() {
    const next = cycleTheme(mode);
    applyTheme(next);
    setMode(next);
  }

  return { mode, onToggleTheme };
}
