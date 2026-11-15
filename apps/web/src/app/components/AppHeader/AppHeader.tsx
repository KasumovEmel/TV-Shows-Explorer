import { AnimatedCount } from '../AnimatedCount';
import { Button } from '../Button';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@/app/components/Brand';

import styles from './styles.module.css';


export function AppHeader({ favoritesPage = false }: { favoritesPage?: boolean }) {
  const { label, href, navigate, icon, count } = usePresenter(favoritesPage);

  return (
    <header className={styles.toolbar}>
      <Brand onClick={navigate} />
      <div className={styles.settings}>
        <ThemeSelector />
        <LanguageSelector />
        <Button
          variant="framedIcon"
          transparent
          icon={icon}
          href={href}
          className={styles.navigation}
          onClick={navigate}
          aria-label={label}
          title={label}
        >
          {count !== undefined && (
            <span className={styles.count}>
              <AnimatedCount value={count} />
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
