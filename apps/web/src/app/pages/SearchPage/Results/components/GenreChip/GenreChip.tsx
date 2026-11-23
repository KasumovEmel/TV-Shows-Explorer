import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';
import type { GenreChipProps } from './types';


export function GenreChip(props: GenreChipProps) {
  const { label, isSelected, select } = usePresenter(props);

  return (
    <Button variant="chip" aria-pressed={isSelected} onClick={select}>
      {label}
    </Button>
  );
}
