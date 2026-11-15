import { useLayoutEffect, useRef } from 'react';


export function usePresenter(value: number) {
  const track = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = value;
    const element = track.current;
    if (
      from === value ||
      !element?.getClientRects().length ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    element.dataset.direction = value > from ? 'up' : 'down';
    element.dataset.previous = String(from);

    function finish() {
      element!.removeAttribute('data-previous');
    }

    element.addEventListener('animationend', finish);
    element.addEventListener('animationcancel', finish);

    return () => {
      element.removeEventListener('animationend', finish);
      element.removeEventListener('animationcancel', finish);
    };
  }, [value]);

  return track;
}
