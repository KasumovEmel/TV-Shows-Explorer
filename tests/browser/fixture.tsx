import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '../../src/app';
import { useNotify } from '../../src/app/notifications';
import { initializeI18n } from '@/i18n';
import type { NotificationEvent } from '../../src/app/notifications';


function FixtureEvents() {
  const notify = useNotify();

  useEffect(() => {
    const receive = (event: Event) => notify((event as CustomEvent<NotificationEvent>).detail);

    window.addEventListener('fixture:notify', receive);

    return () => window.removeEventListener('fixture:notify', receive);
  }, [notify]);

  if (sessionStorage.getItem('fixture:fail')) {
    throw new Error('Fixture render failure');
  }

  return null;
}

const root = document.getElementById('root')!;
void initializeI18n().then(() =>
  createRoot(root).render(
    <App>
      <FixtureEvents />
    </App>,
  ),
);
