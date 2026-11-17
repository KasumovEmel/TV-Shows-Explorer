import styles from './styles.module.css';


const visiblePages = 4;

export function PageNavSkeleton() {
  return Array.from({ length: visiblePages }, (_, index) => (
    <i key={index} className={styles.page} />
  ));
}
