import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { PageNavProps } from './types';


export function usePresenter({ pages, current, jump, loading }: PageNavProps) {
  const { t } = useTranslation();
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => pages <= 5 || n === 1 || n === pages || Math.abs(n - current) <= 1,
  );
  const links = numbers.map((page, i) => ({
    page,
    gap: i > 0 && numbers[i - 1] + 1 < page,
    label: t('catalog.page', { page }),
    href: '#page-' + page,
    active: page === current,
    click: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      jump(page, event.detail === 0);
    },
  }));

  return { links, loading, label: t('catalog.pages') };
}
