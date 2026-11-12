import { usePresenter } from './usePresenter';
import { Button } from '@shared/components/Button';
import { Icon } from '@shared/components/Icon';

import type { SearchFieldProps } from './types';

import styles from './styles.module.css';


export function SearchField(props: SearchFieldProps) {
  const { value, change, clear, inputRef, label, placeholder, clearLabel } = usePresenter(props);
  return (
    <div role="search" className={styles.field}>
      <Icon name="search" size={22} />
      <input
        type="search"
        ref={inputRef}
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={change}
      />
      {value && <Button variant="icon" icon="close" aria-label={clearLabel} onClick={clear} />}
    </div>
  );
}
