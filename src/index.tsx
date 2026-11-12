import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Catalog } from './Catalog';
import { initializeI18n } from './i18n';

const root = document.getElementById('root');
if (!root) throw new Error('Отсутствует корневой элемент приложения');

void initializeI18n().then(() => {
  createRoot(root).render(
    <StrictMode>
      <Catalog />
    </StrictMode>,
  );
});
