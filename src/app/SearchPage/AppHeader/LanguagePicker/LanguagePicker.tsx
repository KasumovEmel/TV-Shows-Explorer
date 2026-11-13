import englishFlag from './english.svg';
import russianFlag from './russian.svg';
import { usePresenter } from './usePresenter';
import { Button } from '@/app/components/Button';

import styles from './styles.module.css';


export function LanguagePicker() {
  const { label, russian, pending, toggle } = usePresenter();

  return (
    <Button
      variant="framedIcon"
      transparent
      icon={
        <img
          className={styles.flag}
          src={russian ? russianFlag : englishFlag}
          width="24"
          height="16"
          alt=""
        />
      }
      aria-label={label}
      title={label}
      aria-disabled={pending}
      onClick={toggle}
    />
  );
}
