import type { ButtonProps } from './types';

import styles from './styles.module.css';


export function usePresenter({
  variant = 'primary',
  isTransparent = false,
  className = '',
  icon,
  children,
  ...control
}: ButtonProps) {
  return {
    control,
    icon,
    children,
    size: variant === 'chip' ? 16 : 21,
    className: [styles.button, styles[variant], isTransparent && styles.transparent, className]
      .filter(Boolean)
      .join(' '),
  };
}
