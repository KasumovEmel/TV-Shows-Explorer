import { Fragment } from 'react';

import { PageNavSkeleton } from './PageNavSkeleton';
import { usePresenter } from './usePresenter';
import type { PageNavProps } from './types';

import styles from './styles.module.css';


export function PageNav(props: PageNavProps) {
  const { label, links, loading } = usePresenter(props);
  const Container = loading ? 'div' : 'nav';

  return (
    <Container
      className={styles.nav}
      aria-label={loading ? undefined : label}
      aria-hidden={loading || undefined}
    >
      <span className={styles.label}>{label}</span>
      <div className={styles.links}>
        {loading && <PageNavSkeleton />}
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
    </Container>
  );
}
