import englishFlag from './assets/english.svg';
import russianFlag from './assets/russian.svg';
import { usePresenter } from './usePresenter';

import styles from './styles.module.css';


export function LanguageSelector() {
  const { label, title, current, isRussian, isPending, toggle } = usePresenter();

  return (
    <button
      type="button"
      aria-label={`${title}, ${current}. ${label}`}
      title={label}
      aria-disabled={isPending}
      onClick={toggle}
    >
      <img
        className={styles.flag}
        src={isRussian ? russianFlag : englishFlag}
        width="20"
        height="14"
        alt=""
      />
      {title}
      <small>{current}</small>
    </button>
  );
}
