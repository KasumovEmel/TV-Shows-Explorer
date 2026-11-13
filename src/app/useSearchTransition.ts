import { useLayoutEffect, useRef } from 'react';


const duration = 560;

export function useSearchTransition(docked: boolean, finishEntrance: () => void) {
  const headerRef = useRef<HTMLElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const resultsRef = useRef<HTMLElement>(null);

  const motion = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const form = inputRef.current?.form;
    const results = resultsRef.current;
    if (!header || !form || !results || header.hasAttribute('data-docked') === docked) {
      return;
    }

    // Sample the visible field first so clearing mid-flight reverses from its current position.
    const from = form.getBoundingClientRect();
    motion.current?.cancel();
    header.toggleAttribute('data-docked', docked);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !form.animate) {
      if (docked) {
        finishEntrance();
      }

      return;
    }

    const to = form.getBoundingClientRect();
    const movement = form.animate(
      [
        {
          transform: `translate(${from.x - to.x}px, ${from.y - to.y}px)`,
          width: `${from.width}px`,
        },
        { transform: 'translate(0, 0)', width: '100%' },
      ],
      { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
    motion.current = movement;
    if (!docked) {
      return;
    }
    const fade = results.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing: 'ease-in-out',
    });
    movement.onfinish = finishEntrance;

    return () => {
      movement.onfinish = null;
      fade.cancel();
    };
  }, [docked, finishEntrance]);

  useLayoutEffect(() => () => motion.current?.cancel(), []);

  return { headerRef, inputRef, resultsRef };
}
