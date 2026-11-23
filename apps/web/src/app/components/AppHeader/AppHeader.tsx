import { LanguageSelector } from './LanguageSelector';
import { PageSwitcher } from './PageSwitcher';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@components/Brand';
import type { AppHeaderProps } from './types';

import styles from './styles.module.css';


export function AppHeader({ isFavoritesPage = false }: AppHeaderProps) {
  const { navigate } = usePresenter();

  return (
    <header className={styles.toolbar}>
      <Brand onClick={navigate} />
      <div className={styles.settings}>
        <ThemeSelector />
        <LanguageSelector />
        <PageSwitcher isFavoritesPage={isFavoritesPage} onClick={navigate} />
      </div>
    </header>
  );
}
