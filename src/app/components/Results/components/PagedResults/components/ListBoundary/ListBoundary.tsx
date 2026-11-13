import { usePresenter } from './usePresenter';

import type { ListBoundaryProps } from './types';

import styles from './styles.module.css';


export function ListBoundary(props: ListBoundaryProps) {
  const { hint, source } = usePresenter(props);
  return (
    <footer className={styles.end}>
      {hint && <span role="status">{hint}</span>}
      <a href="https://www.tvmaze.com/">{source}</a>
    </footer>
  );
}
