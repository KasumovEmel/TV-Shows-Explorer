import { usePresenter } from './usePresenter';
import { Icon } from '@shared/components/Icon';

import type { ButtonProps } from './types';


export function Button(props: ButtonProps) {
  const { button, className, icon, size, children } = usePresenter(props);

  return (
    <button type="button" {...button} className={className}>
      {icon && <Icon name={icon} size={size} />}
      {children}
    </button>
  );
}
