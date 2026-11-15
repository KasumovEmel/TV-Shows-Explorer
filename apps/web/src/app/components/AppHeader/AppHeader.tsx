import { Icon } from '../Icon';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { usePresenter } from './usePresenter';
import { Brand } from '@/app/components/Brand';

import styles from './styles.module.css';


export function AppHeader() {
  const { label, href, navigate, icon } = usePresenter();

  return (
    <header className={styles.toolbar}>
      <Brand />
      <div className={styles.settings}>
        <ThemeSelector />
        <LanguageSelector />
        <a href={href} onClick={navigate} aria-label={label} title={label} className={styles.link}>
          <Icon name={icon} size={20} />
        </a>
      </div>
    </header>
  );
}
