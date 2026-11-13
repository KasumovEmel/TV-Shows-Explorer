import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { usePageScroll } from './usePageScroll';
import { behavior } from '@shared/styles/tokens';

import type { PagedResultsProps } from './types';


export function usePresenter({ cards, loading }: PagedResultsProps) {
  const { t } = useTranslation();

  const total = loading ? 0 : cards.length,
    pages = Math.ceil(total / behavior.pageSize);

  const [opened, setOpened] = useState(1);

  const [current, setCurrent] = useState(1);

  const list = useRef<HTMLDivElement>(null),
    bar = useRef<HTMLDivElement>(null);

  const tail = useRef<HTMLDivElement>(null);

  const jumpY = useRef<number | null>(null);

  const [target, setTarget] = useState<{ page: number; keyboard: boolean } | null>(null);

  const visible = Math.min(opened, pages);
  const groups = Array.from({ length: visible }, (_, i) => ({
    page: i + 1,
    id: 'page-' + (i + 1),
    label: t('catalog.page', { page: i + 1 }),
    cards: cards.slice(i * behavior.pageSize, (i + 1) * behavior.pageSize),
  }));
  function jump(page: number, keyboard: boolean) {
    setOpened((n) => Math.max(n, page));
    setTarget({ page, keyboard });
  }

  usePageScroll(list, bar, jumpY, visible, pages, setOpened, setCurrent);

  useLayoutEffect(() => {
    if (tail.current) {
      tail.current.style.height = '0px';
    }
  }, [visible]);

  useLayoutEffect(() => {
    if (!tail.current) {
      return;
    }
    if (!target || !list.current || !bar.current) {
      return;
    }
    tail.current.style.height = '0px';
    const group = list.current.children[target.page - 1];
    if (!(group instanceof HTMLElement)) {
      return;
    }
    const top = bar.current.offsetHeight;
    const y = window.scrollY + group.getBoundingClientRect().top - top;
    // Give a short group enough room to reach the toolbar, without moving the footer.
    tail.current.style.height =
      Math.max(
        0,
        Math.ceil(y + innerHeight - (window.scrollY + tail.current.getBoundingClientRect().top)),
      ) + 'px';
    window.scrollTo(0, y);
    jumpY.current = window.scrollY;
    if (target.keyboard) {
      group.focus({ preventScroll: true });
    }
    setCurrent(target.page);
    setTarget(null);
  }, [target, pages]);

  return {
    loading,
    heading: t('catalog.results'),
    count: t('catalog.count', { count: total }),
    pages,
    current,
    groups,
    tail,
    jump,
    bar,
    list,
    shown: Math.min(visible * behavior.pageSize, total),
    total,
  };
}
