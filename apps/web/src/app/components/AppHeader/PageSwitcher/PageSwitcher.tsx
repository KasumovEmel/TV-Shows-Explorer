import { usePresenter } from './usePresenter';
import { AnimatedCount } from '@components/AnimatedCount';
import { Button } from '@components/Button';
import type { PageSwitcherProps } from './types';

import styles from './styles.module.css';


export function PageSwitcher({ favoritesPage, onClick }: PageSwitcherProps) {
  const { href, icon, label, count } = usePresenter(favoritesPage);

  return (
    <Button
      variant="framedIcon"
      transparent
      icon={icon}
      href={href}
      className={styles.navigation}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {count !== undefined && (
        <span className={styles.count}>
          <AnimatedCount value={count} />
        </span>
      )}
    </Button>
  );
}
