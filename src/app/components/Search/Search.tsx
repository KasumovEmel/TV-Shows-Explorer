import { LanguagePicker } from './components/LanguagePicker';
import { SearchField } from './components/SearchField';
import { usePresenter } from './usePresenter';
import { Brand } from '@shared/components/Brand';
import { Button } from '@shared/components/Button';

import type { SearchProps } from './types';

import styles from './styles.module.css';


export function Search(props: SearchProps) {
  const { headerRef, label, heading, field, themeIcon, themeLabel, onToggleTheme } =
    usePresenter(props);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.toolbar}>
          <Brand />
          <div className={styles.settings}>
            <Button
              variant="icon"
              icon={themeIcon}
              aria-label={themeLabel}
              title={themeLabel}
              onClick={onToggleTheme}
            />
            <LanguagePicker />
          </div>
        </div>
        <div className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{label}</p>
            <h1>{heading}</h1>
          </div>
          <div className={styles.search}>
            <SearchField {...field} />
          </div>
        </div>
      </div>
    </header>
  );
}
