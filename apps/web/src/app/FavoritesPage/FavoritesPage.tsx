import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { ShowCard } from '../components/ShowCard';
import { animateFavoriteRemoval } from './logic/animateFavoriteRemoval';
import { usePresenter } from './usePresenter';

import styles from './styles.module.css';


export function FavoritesPage() {
  const { title, items, error, retry, label, message } = usePresenter();

  return (
    <>
      <div className={styles.header}>
        <AppHeader favoritesPage />
      </div>
      <main className={styles.page}>
        <h1>{title}</h1>
        {items?.length ? (
          <ul data-empty-label={message}>
            {items.map((show) => (
              <ShowCard key={show.id} show={show} animateRemoval={animateFavoriteRemoval} />
            ))}
          </ul>
        ) : (
          <p role="status">{message}</p>
        )}
        {error && <Button onClick={retry}>{label}</Button>}
      </main>
    </>
  );
}
