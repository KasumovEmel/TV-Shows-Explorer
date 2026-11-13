import { createRoot } from 'react-dom/client';

import { App } from './app';
import { initializeI18n } from '@shared/i18n';


const root = document.getElementById('root');

if (!root) {
  throw new Error('Отсутствует корневой элемент приложения');
}

void initializeI18n().then(() => createRoot(root).render(<App />));
