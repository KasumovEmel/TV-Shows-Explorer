import type { ButtonProps } from './types';

import styles from './styles.module.css';


export function usePresenter({
  variant = 'primary',
  className = '',
  icon,
  children,
  ...button
}: ButtonProps) {
  return {
    button,
    icon,
    children,
    size: variant === 'chip' ? 16 : 21,
    className: [styles.button, styles[variant], className].join(' '),
  };
}
