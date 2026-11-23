import { LanguageSelector } from './LanguageSelector';
import { PageSwitcher } from './PageSwitcher';
import { SettingsMenu } from './SettingsMenu';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@components/Brand';
import type { AppHeaderProps } from './types';

import styles from './styles.module.css';


export function AppHeader({
  isFavoritesPage = false,
  isLoginPage,
  count,
  account,
}: AppHeaderProps) {
  const { navigate, login } = usePresenter();

  return (
    <header className={styles.toolbar}>
      <Brand onClick={navigate} isCompactOnMobile={!!account.email} />
      <div className={styles.controls}>
        {account.email && (
          <>
            <span className={styles.email} title={account.email}>
              {account.email}
            </span>
            <PageSwitcher count={count} isFavoritesPage={isFavoritesPage} onClick={navigate} />
          </>
        )}
        {account.email === null && (
          <a
            className={styles.login}
            href="/login"
            aria-current={isLoginPage ? 'page' : undefined}
            onClick={navigate}
          >
            {login}
          </a>
        )}
        <SettingsMenu account={account}>
          <LanguageSelector />
          <ThemeSelector />
        </SettingsMenu>
      </div>
    </header>
  );
}
