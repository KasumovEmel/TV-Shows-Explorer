import { Fragment } from 'react';

import { usePresenter } from './usePresenter';

import type { PageNavProps } from './types';

import styles from './styles.module.css';


export function PageNav(props: PageNavProps) {
  const { label, links } = usePresenter(props);
  return (
    <nav className={styles.nav} aria-label={label}>
      <span className={styles.label}>{label}</span>
      <div className={styles.links}>
        {links.map(({ page, label, gap, href, active, click }) => (
          <Fragment key={page}>
            {gap && <span aria-hidden="true">…</span>}
            <a
              href={href}
              onClick={click}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              {page}
            </a>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
