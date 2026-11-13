import { behavior } from '@/styles/tokens';

import type { Show } from '../../logic/show';


export function paginateShows(cards: Show[], opened: number) {
  const { pageSize } = behavior;
  const pages = Math.ceil(cards.length / pageSize);
  const visible = Math.min(opened, pages);
  const groups = Array.from({ length: visible }, (_, i) =>
    cards.slice(i * pageSize, (i + 1) * pageSize),
  );

  return { pages, groups, shown: Math.min(visible * pageSize, cards.length) };
}
