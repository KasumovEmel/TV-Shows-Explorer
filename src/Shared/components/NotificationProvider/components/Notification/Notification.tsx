import { usePresenter } from './usePresenter';
import { Button } from '@shared/components/Button';
import { Icon } from '@shared/components/Icon';

import type { NotificationProps } from './types';

import styles from './styles.module.css';


export function Notification(props: NotificationProps) {
  const { kind, title, message, label, enter, leave, close, onEnter, onLeave } =
    usePresenter(props);
  return (
    <div
      className={styles.toast}
      data-kind={kind}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={enter}
      onBlur={leave}
    >
      <Icon name={kind} />
      <div className={styles.copy}>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <Button variant="icon" icon="close" aria-label={label} onClick={close} />
    </div>
  );
}
