import { useRef, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { useDismissTimer } from './logic/useDismissTimer';
import type { NotificationProps } from './types';


export function usePresenter({ kind, id, messageKey, onDismiss }: NotificationProps) {
  const { t } = useTranslation();
  const previous = useRef<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  useDismissTimer(kind === 'success' || kind === 'info', hover || focus, id, onDismiss);

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
    if (event.detail === 0 && previous.current?.isConnected) {
      previous.current.focus({ preventScroll: true });
    }
    onDismiss(id);
  }

  return {
    kind,
    title: t(`notification.${kind}.title`),
    message: t(messageKey ?? `notification.${kind}.message`),
    label: t('notification.dismiss'),
    enter,
    leave,
    close,
    onEnter: () => setHover(true),
    onLeave: () => setHover(false),
  };
}
