import type { GenreChipProps } from './types';


export function usePresenter({ label, selected, select }: GenreChipProps) {
  return { label, selected, select, icon: selected ? ('check' as const) : undefined };
}
