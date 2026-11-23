import { usePresenter } from './usePresenter';
import type { BrandProps } from './types';

import styles from './styles.module.css';


export function Brand({ onClick, isCompactOnMobile }: BrandProps) {
  const { name } = usePresenter();

  return (
    <a
      href="/"
      onClick={onClick}
      className={styles.brand}
      data-compact={isCompactOnMobile || undefined}
      aria-label={name}
      lang="en"
    >
      <svg viewBox="0 0 45 36" aria-hidden="true" focusable="false">
        <rect width="45" height="36" rx="10" fill="var(--brand-icon-background)" />
        <path d="M9 9l12 9-12 9ZM24 9l12 9-12 9Z" fill="var(--brand-icon-glyph)" />
      </svg>
      <span>{name}</span>
    </a>
  );
}
