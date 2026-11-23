import { usePresenter } from './usePresenter';
import { Icon } from '@components/Icon';


export function ThemeSelector() {
  const { themeIcon, themeLabel, title, current, onToggleTheme } = usePresenter();

  return (
    <button
      type="button"
      aria-label={`${title}, ${current}. ${themeLabel}`}
      title={themeLabel}
      onClick={onToggleTheme}
    >
      <Icon name={themeIcon} size={20} />
      {title}
      <small>{current}</small>
    </button>
  );
}
