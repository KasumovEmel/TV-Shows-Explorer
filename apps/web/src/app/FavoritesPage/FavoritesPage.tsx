import { usePresenter } from './usePresenter';
import { AnimatedCount } from '@components/AnimatedCount';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { ShowCard } from '@components/ShowCard';

import styles from './styles.module.css';


export function FavoritesPage() {
  const {
    title,
    headingLabel,
    count,
    items,
    isFailed,
    retry,
    label,
    message,
    animateFavoriteRemoval,
  } = usePresenter();

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
        {items?.length ? (
          <ul data-empty-label={message}>
            {items.map((show) => (
              <ShowCard key={show.id} show={show} animateRemoval={animateFavoriteRemoval} />
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
