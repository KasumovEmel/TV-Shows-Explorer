import { LanguagePicker } from './LanguagePicker';
import { usePresenter } from './usePresenter';
import { Brand } from '@/app/components/Brand';
import { Button } from '@/app/components/Button';

import styles from './styles.module.css';


export function AppHeader() {
  const { themeIcon, themeLabel, onToggleTheme } = usePresenter();

  return (
    <header className={styles.toolbar}>
      <Brand />
      <div className={styles.settings}>
        <Button
          variant="framedIcon"
          transparent
          icon={themeIcon}
          aria-label={themeLabel}
          title={themeLabel}
          onClick={onToggleTheme}
        />
        <LanguagePicker />
      </div>
    </header>
  );
}
