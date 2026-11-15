import { usePresenter } from './usePresenter';
import { Button } from '@/app/components/Button';


export function ThemeSelector() {
  const { themeIcon, themeLabel, onToggleTheme } = usePresenter();

  return (
    <Button
      variant="framedIcon"
      transparent
      icon={themeIcon}
      aria-label={themeLabel}
      title={themeLabel}
      onClick={onToggleTheme}
    />
  );
}
