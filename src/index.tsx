import { createRoot } from 'react-dom/client';

import { initializeI18n } from '@shared/i18n';


const root = document.getElementById('root');

if (!root) {
  throw new Error('Отсутствует корневой элемент приложения');
}

void Promise.all([import(/* webpackChunkName: "catalog" */ './app'), initializeI18n()]).then(
  ([{ App }]) => createRoot(root).render(<App />),
);
