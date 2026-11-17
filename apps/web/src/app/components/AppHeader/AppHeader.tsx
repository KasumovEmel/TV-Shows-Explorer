import { LanguageSelector } from './LanguageSelector';
import { PageSwitcher } from './PageSwitcher';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@components/Brand';
import type { AppHeaderProps } from './types';

import styles from './styles.module.css';


export function AppHeader({ favoritesPage = false }: AppHeaderProps) {
  const { navigate } = usePresenter();

  return (
    <header className={styles.toolbar}>
      <Brand onClick={navigate} />
      <div className={styles.settings}>
        <ThemeSelector />
        <LanguageSelector />
        <PageSwitcher favoritesPage={favoritesPage} onClick={navigate} />
      </div>
    </header>
  );
}
