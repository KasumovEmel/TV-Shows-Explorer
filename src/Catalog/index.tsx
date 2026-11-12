import { usePresenter } from './usePresenter';
import styles from './styles.module.css';

function CatalogContent() {
  const { data: shows, error, mutate } = usePresenter();

  if (!shows) {
    if (error) {
      return (
        <div role="alert">
          <p>Не удалось загрузить каталог.</p>
          <button type="button" onClick={() => void mutate()}>
            Попробовать ещё раз
          </button>
        </div>
      );
    }
    return <p role="status">Загружаем сериалы…</p>;
  }
  if (shows.length === 0) return <p>В каталоге пока нет сериалов.</p>;

  return (
    <ul className={styles.list}>
      {shows.map((show) => (
        <li key={show.id} className={styles.show}>
          <div>
            <h2>{show.title}</h2>
            <span>{show.originalTitle}</span>
          </div>
          <span>{show.genre}</span>
          <span>{show.year}</span>
        </li>
      ))}
    </ul>
  );
}

export function Catalog() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand} lang="en">
          TV Shows Explorer
        </span>
        <h1>Каталог сериалов</h1>
      </header>
      <CatalogContent />
    </main>
  );
}
