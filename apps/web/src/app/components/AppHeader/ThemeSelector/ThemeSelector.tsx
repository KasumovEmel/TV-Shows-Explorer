import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';


export function ThemeSelector() {
  const { themeIcon, themeLabel, onToggleTheme } = usePresenter();

  return (
    <Button
      variant="framedIcon"
      isTransparent
      icon={themeIcon}
      aria-label={themeLabel}
      title={themeLabel}
      onClick={onToggleTheme}
    />
  );
}
