import englishFlag from './assets/english.svg';
import russianFlag from './assets/russian.svg';
import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';

import styles from './styles.module.css';


export function LanguageSelector() {
  const { label, isRussian, isPending, toggle } = usePresenter();

  return (
    <Button
      variant="framedIcon"
      isTransparent
      icon={
        <img
          className={styles.flag}
          src={isRussian ? russianFlag : englishFlag}
          width="24"
          height="16"
          alt=""
        />
      }
      aria-label={label}
      title={label}
      aria-disabled={isPending}
      onClick={toggle}
    />
  );
}
