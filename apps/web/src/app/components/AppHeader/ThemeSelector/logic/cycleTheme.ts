export type ThemeMode = 'system' | 'dark' | 'light';

const nextMode: Record<ThemeMode, ThemeMode> = { system: 'dark', dark: 'light', light: 'system' };

export function cycleTheme(mode: ThemeMode) {
  return nextMode[mode];
}
