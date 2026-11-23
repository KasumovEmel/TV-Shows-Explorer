import { usePresenter } from './usePresenter';
import { AnimatedCount } from '@components/AnimatedCount';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { ShowCard } from '@components/ShowCard';
import type { FavoritesPageProps } from './types';

import styles from './styles.module.css';


export function FavoritesPage(props: FavoritesPageProps) {
  const { title, headingLabel, count, rows, isFailed, retry, label, message, remove } =
    usePresenter(props);

  return (
    <>
      <div className={styles.header}>
        <AppHeader isFavoritesPage />
      </div>
      <main className={styles.page}>
        <h1 aria-label={headingLabel}>
          {title}
          {count !== undefined && (
            <>
              {' '}
              (<AnimatedCount value={count} />)
            </>
          )}
        </h1>
        {rows.length ? (
          <ul data-empty-label={message}>
            {rows.map((show) => (
              <ShowCard key={show.id} show={show} isSaved onAction={remove(show)} />
            ))}
          </ul>
        ) : (
          <p role="status">{message}</p>
        )}
        {isFailed && <Button onClick={retry}>{label}</Button>}
      </main>
    </>
  );
}
