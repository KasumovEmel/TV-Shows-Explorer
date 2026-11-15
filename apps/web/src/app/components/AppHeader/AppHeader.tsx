import { LanguageSelector } from './LanguageSelector';
import { PageSwitcher } from './PageSwitcher';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@/app/components/Brand';

import styles from './styles.module.css';


export function AppHeader({ favoritesPage = false }: { favoritesPage?: boolean }) {
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
