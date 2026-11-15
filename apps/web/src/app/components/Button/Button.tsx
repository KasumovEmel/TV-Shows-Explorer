import { Icon } from '../Icon';
import { usePresenter } from './usePresenter';
import type { ButtonProps } from './types';


export function Button(props: ButtonProps) {
  const { button, className, icon, size, children } = usePresenter(props);

  return (
    <button type="button" {...button} className={className}>
      {typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon}
      {children}
    </button>
  );
}
