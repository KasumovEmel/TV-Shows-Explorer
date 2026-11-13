import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { usePageScroll } from './logic/hooks/usePageScroll';
import { usePageViewport } from './logic/hooks/usePageViewport';
import { paginateShows } from './logic/paginateShows';

import type { PagedResultsProps } from './types';


export function usePresenter({ cards, loading }: PagedResultsProps) {
  const { t } = useTranslation();

  const [opened, setOpened] = useState(1);

  const [current, setCurrent] = useState(1);

  const list = useRef<HTMLDivElement>(null),
    bar = useRef<HTMLDivElement>(null);

  const pendingJump = useRef<{ page: number; keyboard: boolean } | null>(null);

  const total = loading ? 0 : cards.length;
  const { groups: pageCards, pages, shown } = paginateShows(loading ? [] : cards, opened);
  const visible = pageCards.length;
  const groups = pageCards.map((cards, i) => ({
    page: i + 1,
    id: 'page-' + (i + 1),
    label: t('catalog.page', { page: i + 1 }),
    cards,
  }));
  function jump(page: number, keyboard: boolean) {
    if (page <= visible) {
      jumpToPage(page, keyboard);
    } else {
      pendingJump.current = { page, keyboard };
      setOpened(page);
    }
  }

  const { jumpY, jumpToPage } = usePageViewport(list, bar, visible, pages, setCurrent);

  usePageScroll(list, jumpY, visible, pages, setOpened);

  useLayoutEffect(() => {
    const target = pendingJump.current;
    if (target) {
      pendingJump.current = null;
      jumpToPage(target.page, target.keyboard);
    }
  }, [visible, jumpToPage]);

  return {
    loading,
    heading: t('catalog.results'),
    count: t('catalog.count', { count: total }),
    pages,
    current,
    groups,
    jump,
    bar,
    list,
    shown,
    total,
  };
}
