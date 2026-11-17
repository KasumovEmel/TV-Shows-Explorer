import { usePresenter } from './usePresenter';
import type { AnimatedCountProps } from './types';

import styles from './styles.module.css';


export function AnimatedCount({ value }: AnimatedCountProps) {
  const track = usePresenter(value);

  return (
    <span className={styles.window} aria-hidden="true">
      <span key={value} className={styles.track} ref={track}>
        <span>{value}</span>
      </span>
    </span>
  );
}
