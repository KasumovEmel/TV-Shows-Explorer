import { Button } from '../../../../components/Button';
import { usePresenter } from './usePresenter';
import type { GenreChipProps } from './types';


export function GenreChip(props: GenreChipProps) {
  const { label, selected, select } = usePresenter(props);

  return (
    <Button variant="chip" aria-pressed={selected} onClick={select}>
      {label}
    </Button>
  );
}
