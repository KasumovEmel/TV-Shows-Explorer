import { useEffect } from 'react';

import type { RefObject } from 'react';


export function usePageScroll(
  list: RefObject<HTMLDivElement | null>,
  bar: RefObject<HTMLDivElement | null>,
  jumpY: RefObject<number | null>,
  opened: number,
  pages: number,
  open: (page: number) => void,
  select: (page: number) => void,
) {
  useEffect(() => {
    if (pages < 2) {
      return;
    }
    let previous = window.scrollY;
    let touchY = 0;
    // Each boundary belongs to one rendered group. Repeated events before a render are idempotent.
    const atEnd = () =>
      (list.current?.getBoundingClientRect().bottom ?? Infinity) <= window.innerHeight + 2;
    function advance() {
      if (opened < pages && atEnd()) {
        open(opened + 1);
      }
    }
    function scroll() {
      const y = window.scrollY;
      if (jumpY.current === y) {
        previous = y;

        return;
      }
      jumpY.current = null;
      const groups = Array.from(list.current?.children ?? []);
      const top = bar.current?.offsetHeight ?? 0;
      let active = 1;
      groups.forEach((group, i) => {
        if (group.getBoundingClientRect().top <= top + 1) {
          active = i + 1;
        }
      });
      const bottom = y > 0 && Math.ceil(y + innerHeight) >= document.documentElement.scrollHeight;
      select(bottom ? opened : active);
      if (y > previous) {
        advance();
      }
      previous = y;
    }
    function wheel(e: WheelEvent) {
      if (!e.ctrlKey && e.deltaY > 0) {
        advance();
      }
    }
    function start(e: TouchEvent) {
      touchY = e.touches[0].clientY;
    }
    function move(e: TouchEvent) {
      const y = e.touches[0].clientY;
      if (y < touchY) {
        advance();
      }
      touchY = y;
    }
    function key(e: KeyboardEvent) {
      if (
        e.defaultPrevented ||
        e.altKey ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest('input,select,textarea,button,[contenteditable]'))
      ) {
        return;
      }
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) {
        advance();
      }
    }
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('keydown', key);

    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('keydown', key);
    };
  }, [list, bar, jumpY, opened, pages, open, select]);
}
