import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { AppShell } from '../../src/AppShell';
import { Catalog } from '../../src/AppShell/components/Catalog';
import { useNotify } from '@shared/components/NotificationProvider';
import { initializeI18n } from '@shared/i18n';

import type { CatalogProps } from '../../src/AppShell/components/Catalog';
import type { NotificationEvent } from '@shared/components/NotificationProvider';

import '@shared/styles/base.css';


function FixtureScreen(props: CatalogProps) {
  const notify = useNotify();
  useEffect(() => {
    const receive = (event: Event) => notify((event as CustomEvent<NotificationEvent>).detail);
    window.addEventListener('fixture:notify', receive);
    return () => window.removeEventListener('fixture:notify', receive);
  }, [notify]);
  if (sessionStorage.getItem('fixture:fail')) throw new Error('Fixture render failure');
  return <Catalog {...props} />;
}
void initializeI18n().then(() => {
  const root = document.getElementById('root');
  if (root)
    createRoot(root).render(
      <StrictMode>
        <AppShell Screen={FixtureScreen} />
      </StrictMode>,
    );
});
