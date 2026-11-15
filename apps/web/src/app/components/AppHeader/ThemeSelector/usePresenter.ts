import { useTranslation } from 'react-i18next';

import { useTheme } from './logic/useTheme';


const icons = { system: 'sunMoon', dark: 'moon', light: 'sun' } as const;

export function usePresenter() {
  const { t } = useTranslation();
  const { mode, onToggleTheme } = useTheme();

  return {
    themeIcon: icons[mode],
    themeLabel: t(`theme.${mode}`),
    onToggleTheme,
  };
}
