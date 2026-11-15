import { useCallback, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';


export function usePageViewport(
  list: RefObject<HTMLDivElement | null>,
  bar: RefObject<HTMLDivElement | null>,
  opened: number,
  pages: number,
  select: (page: number) => void,
) {
  const jumpY = useRef<number | null>(null);

  useLayoutEffect(() => {
    const groups = list.current;
    const toolbar = bar.current;
    if (!groups || !toolbar || pages < 2) {
      return;
    }

    const markCurrent = () => {
      const y = window.scrollY;
      if (jumpY.current === y) {
        return;
      }
      jumpY.current = null;
      if (y <= 0) {
        select(1);

        return;
      }
      // The results end at the last card. The footer and its padding can still be below the fold.
      if (opened === pages && groups.getBoundingClientRect().bottom <= innerHeight + 1) {
        select(pages);

        return;
      }
      const top = toolbar.getBoundingClientRect().bottom;
      let page = 1;
      let largestFraction = 0;
      for (const [index, group] of Array.from(groups.children).entries()) {
        const bounds = group.getBoundingClientRect();
        if (bounds.top >= innerHeight) {
          break;
        }
        const visibleHeight = Math.max(
          0,
          Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, top),
        );
        const fraction = visibleHeight / bounds.height;
        if (fraction > largestFraction) {
          largestFraction = fraction;
          page = index + 1;
        }
      }
      select(page);
    };

    markCurrent();
    const observer = new ResizeObserver(markCurrent);
    observer.observe(groups);
    observer.observe(toolbar);
    window.addEventListener('resize', markCurrent);
    window.addEventListener('scroll', markCurrent, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', markCurrent);
      window.removeEventListener('scroll', markCurrent);
    };
  }, [list, bar, opened, pages, select]);

  const jumpToPage = useCallback(
    (page: number, keyboard: boolean) => {
      const group = list.current?.children[page - 1];
      const toolbar = bar.current;
      if (!(group instanceof HTMLElement) || !toolbar) {
        return;
      }
      window.scrollTo(0, window.scrollY + group.getBoundingClientRect().top - toolbar.offsetHeight);
      jumpY.current = window.scrollY;
      select(page);
      if (keyboard) {
        group.focus({ preventScroll: true });
      }
    },
    [list, bar, select],
  );

  return { jumpY, jumpToPage };
}
