import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { Brand } from '@/app/components/Brand';

import styles from './styles.module.css';


export function AppHeader() {
  return (
    <header className={styles.toolbar}>
      <Brand />
      <div className={styles.settings}>
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </header>
  );
}
