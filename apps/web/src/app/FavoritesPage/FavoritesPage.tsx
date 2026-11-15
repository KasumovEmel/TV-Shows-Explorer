import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { ShowCard } from '../components/ShowCard';
import { usePresenter } from './usePresenter';

import styles from './styles.module.css';


export function FavoritesPage() {
  const { title, items, error, retry, label, message } = usePresenter();

  return (
    <>
      <div className={styles.header}>
        <AppHeader />
      </div>
      <main className={styles.page}>
        <h1>{title}</h1>
        {items?.length ? (
          <ul>
            {items.map((show) => (
              <ShowCard key={show.id} show={show} />
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
