import styles from './styles.module.css';


const visibleChips = 8;

export function ChipSkeleton() {
  return Array.from({ length: visibleChips }, (_, index) => (
    <i key={index} className={styles.chip} />
  ));
}
