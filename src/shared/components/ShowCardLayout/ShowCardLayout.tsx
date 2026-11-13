import type { ShowCardLayoutProps } from './types';

import styles from './styles.module.css';
import tiles from '@shared/styles/tiles.module.css';


export function ShowCardLayout({
  poster,
  title,
  year,
  rating,
  summary,
  genres,
}: ShowCardLayoutProps) {
  return (
    <li className={tiles.tile}>
      <div aria-hidden="true" className={`${tiles.poster} ${styles.poster}`}>
        {poster}
      </div>
      <div className={styles.intro}>
        <h3>{title}</h3>
        <p className={styles.meta}>
          <span>{year}</span>
          <span className={styles.rating}>{rating}</span>
        </p>
      </div>
      <div className={styles.details}>
        <p>{summary}</p>
        <p className={styles.genres}>{genres}</p>
      </div>
    </li>
  );
}
