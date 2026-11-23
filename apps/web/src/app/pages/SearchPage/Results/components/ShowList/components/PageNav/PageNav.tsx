import { Fragment } from 'react';

import { PageNavSkeleton } from './PageNavSkeleton';
import { usePresenter } from './usePresenter';
import type { PageNavProps } from './types';

import styles from './styles.module.css';


export function PageNav(props: PageNavProps) {
  const { label, links, isLoading } = usePresenter(props);
  const Container = isLoading ? 'div' : 'nav';

  return (
    <Container
      className={styles.nav}
      aria-label={isLoading ? undefined : label}
      aria-hidden={isLoading || undefined}
    >
      <span className={styles.label}>{label}</span>
      <div className={styles.links}>
        {isLoading && <PageNavSkeleton />}
        {links.map(({ page, label, isGapBeforePage, href, isActive, click }) => (
          <Fragment key={page}>
            {isGapBeforePage && <span aria-hidden="true">…</span>}
            <a
              href={href}
              onClick={click}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </a>
          </Fragment>
        ))}
      </div>
    </Container>
  );
}
