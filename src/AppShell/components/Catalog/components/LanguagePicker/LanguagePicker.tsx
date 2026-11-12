import { usePresenter } from './usePresenter';
import styles from './styles.module.css';
export function LanguagePicker() {
  const { label, value, disabled, select, options } = usePresenter();
  return (
    <select
      className={styles.select}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={select}
    >
      {options.map(([code, name]) => (
        <option key={code} value={code} lang={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
