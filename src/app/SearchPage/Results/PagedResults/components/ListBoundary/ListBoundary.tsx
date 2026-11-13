import { usePresenter } from './usePresenter';

import type { ListBoundaryProps } from './types';

import styles from './styles.module.css';


export function ListBoundary(props: ListBoundaryProps) {
  const { loading, hint, source } = usePresenter(props);
  const Source = loading ? 'span' : 'a';
  const placeholder = loading ? styles.placeholder : undefined;
  const href = loading ? undefined : 'https://www.tvmaze.com/';
  const role = loading ? undefined : 'status';

  return (
    <footer className={styles.end} aria-hidden={loading || undefined}>
      {hint && (
        <span role={role}>
          <span className={placeholder}>{hint}</span>
        </span>
      )}
      <Source className={styles.source} href={href}>
        <span className={placeholder}>{source}</span>
      </Source>
    </footer>
  );
}
