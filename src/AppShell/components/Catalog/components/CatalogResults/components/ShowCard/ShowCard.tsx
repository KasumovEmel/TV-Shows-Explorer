import type { ShowCardProps } from './types';
import { usePresenter } from './usePresenter';
import styles from './styles.module.css';
export function ShowCard(props: ShowCardProps) {
  const { title, original, year, genre } = usePresenter(props);
  return (
    <li className={styles.card}>
      <div aria-hidden="true" className={styles.poster}>
        <svg viewBox="0 0 38 32" width="38" height="32">
          <rect
            x="1"
            y="1"
            width="36"
            height="30"
            rx="3"
            fill="var(--tint)"
            stroke="currentColor"
          />
          <circle cx="19" cy="16" r="6" fill="none" stroke="currentColor" />
        </svg>
      </div>
      <div className={styles.details}>
        <h3>{title}</h3>
        {original && <small lang="en">{original}</small>}
        <p className={styles.meta}>
          <span>{year}</span>
          {genre}
        </p>
      </div>
    </li>
  );
}
