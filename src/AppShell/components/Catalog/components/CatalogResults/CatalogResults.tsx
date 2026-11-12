import { Button } from '@shared/components/Button';
import { ShowCard } from './components/ShowCard';
import { usePresenter } from './usePresenter';
import type { CatalogResultsProps } from './types';
import styles from './styles.module.css';
export function CatalogResults(props: CatalogResultsProps) {
  const { t, cards, chips, hasGenres, failed, loading, retry, emptyCatalog, count } =
    usePresenter(props);
  return (
    <section className={styles.results}>
      {loading ? (
        <p role="status">{t('catalog.loading')}</p>
      ) : failed ? (
        <div role="alert">
          <p>{t('catalog.error')}</p>
          <Button icon="restore" onClick={retry}>
            {t('catalog.retry')}
          </Button>
        </div>
      ) : (
        <>
          {hasGenres && (
            <div className={styles.genres} role="group" aria-label={t('catalog.genres')}>
              <span>{t('catalog.genres')}</span>
              {chips.map(({ value, label, selected, select }) => (
                <Button
                  key={value}
                  variant="chip"
                  icon={selected ? 'check' : undefined}
                  aria-pressed={selected}
                  onClick={select}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
          <div className={styles.heading}>
            <h2>{t('catalog.results')}</h2>
            <span role="status">{count}</span>
          </div>
          {cards.length ? (
            <>
              <ul className={styles.list}>
                {cards.map(({ id, ...card }) => (
                  <ShowCard key={id} {...card} />
                ))}
              </ul>
              <p className={styles.end}>{t('catalog.end')}</p>
            </>
          ) : (
            <p role="status">
              {emptyCatalog ? t('catalog.empty') : t('catalog.noMatches')}{' '}
              {!emptyCatalog && t('catalog.tryAnother')}
            </p>
          )}
        </>
      )}
    </section>
  );
}
