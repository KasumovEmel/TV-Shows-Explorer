import { useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { useDismissTimer } from './logic/hooks/useDismissTimer';
import type { NotificationLayerParams } from './logic/types/NotificationPresentation';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useDismissTimer({ isPaused: isHovered || isFocused, id, expire: onExpire });

  function present({ item, depth }: NotificationLayerParams) {
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

  const layers = cards.map((item, index) => present({ item, depth: cards.length - 1 - index }));
  if (departing) {
    layers.push(present({ item: departing, depth: 'departing' }));
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
      setIsFocused(true);
    }
  }

  function leave(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
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
    onEnter: () => setIsHovered(true),
    onLeave: () => setIsHovered(false),
  };
}
