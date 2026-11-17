import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useMorePages } from './logic/hooks/useMorePages';
import { usePageScroll } from './logic/hooks/usePageScroll';
import { usePageViewport } from './logic/hooks/usePageViewport';
import type { PageJump, ShowListProps } from './types';


export function usePresenter(props: ShowListProps) {
  const { t } = useTranslation();
  const { loading } = props;
  const { groups: pageCards, total, pages, open, failed, retry } = useMorePages(props);
  const [current, setCurrent] = useState(1);
  const list = useRef<HTMLDivElement>(null),
    bar = useRef<HTMLDivElement>(null);
  const pendingJump = useRef<PageJump | null>(null);
  const shown = pageCards.reduce((sum, group) => sum + group.items.length, 0);
  const visible = pageCards.length;
  const groups = pageCards.map(({ items: cards }, i) => ({
    page: i + 1,
    id: 'page-' + (i + 1),
    label: t('catalog.page', { page: i + 1 }),
    cards,
  }));

  function jump({ page, keyboard }: PageJump) {
    if (page <= visible) {
      jumpToPage({ page, keyboard });
    } else {
      pendingJump.current = { page, keyboard };
      open(page);
    }
  }

  const { jumpY, jumpToPage } = usePageViewport({
    list,
    bar,
    opened: visible,
    pages,
    select: setCurrent,
  });

  usePageScroll({ list, jumpY, opened: visible, pages, open });

  useLayoutEffect(() => {
    const target = pendingJump.current;
    if (target && target.page <= visible) {
      pendingJump.current = null;
      jumpToPage({ page: target.page, keyboard: target.keyboard });
    }
  }, [visible, jumpToPage]);

  return {
    failed,
    retry,
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
