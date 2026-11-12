import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppShell } from './AppShell';
import { initializeI18n } from '@shared/i18n';

import '@shared/styles/base.css';


const root = document.getElementById('root');
if (!root) throw new Error('Отсутствует корневой элемент приложения');

void initializeI18n().then(() => {
  createRoot(root).render(
    <StrictMode>
      <AppShell />
    </StrictMode>,
  );
});
