import { usePresenter } from './usePresenter';

import type { ShowCardProps } from './types';

import styles from './styles.module.css';
import tiles from '@shared/styles/tiles.module.css';


export function ShowCard(props: ShowCardProps) {
  const { title, year, rating, ratingLabel, summary, genres, genresLabel, poster, onError } =
    usePresenter(props);
  return (
    <li className={tiles.tile}>
      <div aria-hidden="true" className={`${tiles.poster} ${styles.poster}`}>
        {poster ? (
          <img alt="" src={poster} onError={onError} />
        ) : (
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
        )}
      </div>
      <div className={styles.intro}>
        <h3>{title}</h3>
        <p className={styles.meta}>
          <span>{year}</span>
          <span className={styles.rating} role="img" aria-label={ratingLabel} title={ratingLabel}>
            <span aria-hidden="true">★</span> {rating}
          </span>
        </p>
      </div>
      <div className={styles.details}>
        <p>{summary}</p>
        <p className={styles.genres}>
          <strong>{genresLabel}:</strong> {genres}
        </p>
      </div>
    </li>
  );
}
