import styles from './styles.module.css';


export function CountSkeleton() {
  return <span aria-hidden="true" className={styles.count} />;
}
