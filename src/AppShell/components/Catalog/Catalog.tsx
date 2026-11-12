import { CatalogResults } from './components/CatalogResults';
import { LanguagePicker } from './components/LanguagePicker';
import { usePresenter } from './usePresenter';
import { Brand } from '@shared/components/Brand';
import { SearchField } from '@shared/components/SearchField';

import type { CatalogProps } from './types';

import styles from './styles.module.css';


export function Catalog(props: CatalogProps) {
  const { t, query, change, inputRef, submit, term, committed, start } = usePresenter(props);
  return (
    <main>
      <header className={start ? styles.start : styles.header}>
        <div className={styles.inner}>
          {!start && (
            <div className={styles.toolbar}>
              <Brand />
              <LanguagePicker />
            </div>
          )}
          <div className={styles.hero}>
            {!start && (
              <div>
                <p className={styles.eyebrow}>{t('search.label')}</p>
                <h1>{t('catalog.heading')}</h1>
              </div>
            )}
            <div className={styles.search}>
              <SearchField value={query} onChange={change} onSubmit={submit} inputRef={inputRef} />
            </div>
          </div>
        </div>
      </header>
      {!start && <CatalogResults key={term} query={committed} />}
    </main>
  );
}
