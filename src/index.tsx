import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Catalog } from './Catalog';

const root = document.getElementById('root');
if (!root) throw new Error('Отсутствует корневой элемент приложения');

createRoot(root).render(
  <StrictMode>
    <Catalog />
  </StrictMode>,
);
