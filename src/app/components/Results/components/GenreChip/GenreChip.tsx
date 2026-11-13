import { usePresenter } from './usePresenter';
import { Button } from '@shared/components/Button';

import type { GenreChipProps } from './types';


export function GenreChip(props: GenreChipProps) {
  const { label, selected, select } = usePresenter(props);

  return (
    <Button variant="chip" aria-pressed={selected} onClick={select}>
      {label}
    </Button>
  );
}
