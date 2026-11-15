import type { MouseEventHandler } from 'react';

import { usePresenter } from './usePresenter';
import { AnimatedCount } from '@/app/components/AnimatedCount';
import { Button } from '@/app/components/Button';

import styles from './styles.module.css';


type Props = { favoritesPage: boolean; onClick: MouseEventHandler<HTMLAnchorElement> };

export function PageSwitcher({ favoritesPage, onClick }: Props) {
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
