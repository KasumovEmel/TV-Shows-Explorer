import { ShowCardLayout } from '../ShowCardLayout';
import { usePresenter } from './usePresenter';
import type { ShowCardProps } from './types';


export function ShowCard(props: ShowCardProps) {
  const { title, year, rating, ratingLabel, summary, genres, genresLabel, poster, onError } =
    usePresenter(props);

  return (
    <ShowCardLayout
      poster={
        poster ? (
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
        )
      }
      title={title}
      year={year}
      rating={
        <span role="img" aria-label={ratingLabel} title={ratingLabel}>
          <span aria-hidden="true">★</span> {rating}
        </span>
      }
      summary={summary}
      genres={
        <>
          <strong>{genresLabel}:</strong> {genres}
        </>
      }
    />
  );
}
