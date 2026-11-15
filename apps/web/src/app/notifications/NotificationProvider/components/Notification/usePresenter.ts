import { useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { useDismissTimer } from './logic/useDismissTimer';
import type { QueuedNotification } from '../../types';
import type { NotificationProps } from './types';


export function usePresenter({
  cards,
  departing,
  onDismiss,
  onExpire,
  onExitEnd,
}: NotificationProps) {
  const { t } = useTranslation();
  const { kind, id } = cards[cards.length - 1];
  const exitRef = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  useDismissTimer(hover || focus, id, onExpire);

  function present(item: QueuedNotification, depth: number | 'departing') {
    const { show } = item;

    return {
      id: item.id,
      kind: item.kind,
      depth,
      title: t(`notification.${item.kind}.title`),
      message: t(item.messageKey ?? `notification.${item.kind}.message`, {
        title: show && t('titles.' + show.id, { defaultValue: show.originalTitle }),
      }),
    };
  }

  const layers = cards.map((item, index) => present(item, cards.length - 1 - index));
  if (departing) {
    layers.push(present(departing, 'departing'));
  }

  useLayoutEffect(() => {
    if (!departing) {
      return;
    }
    const motions = exitRef.current?.getAnimations?.() ?? [];
    void Promise.allSettled(motions.map((motion) => motion.finished)).then(() =>
      onExitEnd(departing.id),
    );
  }, [departing, onExitEnd]);

  function enter(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      previous.current = event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
      setFocus(true);
    }
  }

  function leave(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocus(false);
    }
  }

  function close(event: MouseEvent<HTMLButtonElement>) {
    if (document.activeElement === event.currentTarget) {
      if (previous.current?.isConnected) {
        previous.current.focus({ preventScroll: true });
      }
      if (document.activeElement === event.currentTarget) {
        event.currentTarget.blur();
      }
    }
    onDismiss(id);
  }

  return {
    kind,
    layers,
    exitRef,
    label: t('notification.dismiss'),
    enter,
    leave,
    close,
    onEnter: () => setHover(true),
    onLeave: () => setHover(false),
  };
}
