import { usePresenter } from './usePresenter';
import { Icon } from '@components/Icon';
import type { ButtonProps } from './types';


export function Button(props: ButtonProps) {
  const { control, className, icon, size, children } = usePresenter(props);
  const glyph = typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon;
  if ('href' in control) {
    return (
      <a {...control} className={className}>
        {glyph}
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...control} className={className}>
      {glyph}
      {children}
    </button>
  );
}
