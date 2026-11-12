import { usePresenter } from './usePresenter';

import type { ListBoundaryProps } from './types';

import styles from './styles.module.css';


export function ListBoundary(props: ListBoundaryProps) {
  const { label, progress, source } = usePresenter(props);
  return (
    <footer className={styles.end}>
      <span role="status">{label}</span>
      <a href="https://www.tvmaze.com/">{source}</a>
      <small>{progress}</small>
    </footer>
  );
}
