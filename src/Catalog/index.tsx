import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../LanguagePicker';
import { usePresenter } from './usePresenter';
import styles from './styles.module.css';

function CatalogContent() {
  const { t } = useTranslation();
  const { data: shows, error, mutate } = usePresenter();

  if (!shows) {
    if (error) {
      return (
        <div role="alert">
          <p>{t('catalog.error')}</p>
          <button type="button" onClick={() => void mutate()}>
            {t('catalog.retry')}
          </button>
        </div>
      );
    }
    return <p role="status">{t('catalog.loading')}</p>;
  }
  if (shows.length === 0) return <p>{t('catalog.empty')}</p>;

  return (
    <ul className={styles.list}>
      {shows.map((show) => {
        const title = t(`titles.${show.id}`, { defaultValue: show.originalTitle });
        return (
          <li key={show.id} className={styles.show}>
            <div>
              <h2>{title}</h2>
              {title !== show.originalTitle && <span>{show.originalTitle}</span>}
            </div>
            <span>{t(`genres.${show.genre}`, { defaultValue: show.genre })}</span>
            <span>{show.year}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Catalog() {
  const { t } = useTranslation();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.toolbar}>
          <span className={styles.brand} lang="en">
            TV Shows Explorer
          </span>
          <LanguagePicker />
        </div>
        <h1>{t('catalog.heading')}</h1>
      </header>
      <CatalogContent />
    </main>
  );
}
