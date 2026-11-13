import { SearchField } from './components/SearchField';
import { usePresenter } from './usePresenter';

import type { SearchIntroProps } from './types';

import styles from './styles.module.css';


export function SearchIntro(props: SearchIntroProps) {
  const { introRef, headingId, label, heading, field } = usePresenter(props);

  return (
    <section ref={introRef} className={styles.intro} aria-labelledby={headingId}>
      <div>
        <p className={styles.eyebrow}>{label}</p>
        <h1 id={headingId}>{heading}</h1>
      </div>
      <div className={styles.search}>
        <SearchField {...field} />
      </div>
    </section>
  );
}
