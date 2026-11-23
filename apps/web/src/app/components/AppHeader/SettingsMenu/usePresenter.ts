import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { SettingsMenuProps } from './types';


export function usePresenter({ account }: SettingsMenuProps) {
  const { t } = useTranslation();
  const panelId = useId();
  const [isOpen, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    const close = () => setOpen(false);

    document.addEventListener('pointerdown', dismissOutside);
    window.addEventListener('popstate', close);

    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      window.removeEventListener('popstate', close);
    };
  }, [isOpen]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    }
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  function logout() {
    setOpen(false);
    trigger.current?.focus();
    account.logout();
  }

  return {
    root,
    trigger,
    isOpen,
    panelId,
    menuLabel: t('settings.menu'),
    logoutLabel: t('auth.logout'),
    toggle: () => setOpen((open) => !open),
    onBlur,
    onKeyDown,
    logout,
  };
}
