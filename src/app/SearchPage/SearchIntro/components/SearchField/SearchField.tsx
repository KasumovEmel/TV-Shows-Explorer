import { Button } from '../../../../components/Button';
import { Icon } from '../../../../components/Icon';
import { usePresenter } from './usePresenter';

import type { SearchFieldProps } from './types';

import styles from './styles.module.css';


export function SearchField(props: SearchFieldProps) {
  const { value, change, submit, clear, inputRef, label, placeholder, clearLabel } =
    usePresenter(props);

  return (
    <form onSubmit={submit} role="search" className={styles.field}>
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
    </form>
  );
}
