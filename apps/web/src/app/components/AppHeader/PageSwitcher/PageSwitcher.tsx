import { usePresenter } from './usePresenter';
import { AnimatedCount } from '@components/AnimatedCount';
import { Button } from '@components/Button';
import type { PageSwitcherProps } from './types';

import styles from './styles.module.css';


export function PageSwitcher(props: PageSwitcherProps) {
  const { href, icon, label, count } = usePresenter(props);

  return (
    <Button
      variant="framedIcon"
      isTransparent
      icon={icon}
      href={href}
      className={styles.navigation}
      aria-label={label}
      title={label}
      onClick={props.onClick}
    >
      {count !== undefined && (
        <span className={styles.count}>
          <AnimatedCount value={count} />
        </span>
      )}
    </Button>
  );
}
