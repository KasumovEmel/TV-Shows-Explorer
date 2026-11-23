import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';


// Figure spaces reserve the same width as digits in the translated footer.
const pendingCounts = { shown: '\u2007', total: '\u2007\u2007' };

export function ListBoundarySkeleton() {
  const { t } = useTranslation();

  return (
    <>
      <span>
        <span className={styles.placeholder}>{t('catalog.more', pendingCounts)}</span>
      </span>
      <span>
        <span className={styles.placeholder}>{t('catalog.source')}</span>
      </span>
    </>
  );
}
