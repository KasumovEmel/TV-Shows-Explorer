import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useMorePages } from './logic/hooks/useMorePages';
import { usePageScroll } from './logic/hooks/usePageScroll';
import { usePageViewport } from './logic/hooks/usePageViewport';
import type { PageJump } from './components/PageNav';
import type { ShowListProps } from './types';


export function usePresenter(props: ShowListProps) {
  const { t } = useTranslation();
  const { isLoading } = props;
  const { groups: pageCards, total, pages, open, isFailed, retry } = useMorePages(props);
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

  function jump({ page, isKeyboardNavigation }: PageJump) {
    if (page <= visible) {
      jumpToPage({ page, isKeyboardNavigation });
    } else {
      pendingJump.current = { page, isKeyboardNavigation };
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
      jumpToPage({ page: target.page, isKeyboardNavigation: target.isKeyboardNavigation });
    }
  }, [visible, jumpToPage]);

  return {
    isFailed,
    retry,
    isLoading,
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
