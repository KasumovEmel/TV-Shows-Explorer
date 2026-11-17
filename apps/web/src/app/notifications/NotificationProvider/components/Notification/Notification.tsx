import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import type { NotificationProps } from './types';

import styles from './styles.module.css';


export function Notification(props: NotificationProps) {
  const { kind, layers, exitRef, label, enter, leave, close, onEnter, onLeave } =
    usePresenter(props);

  return (
    <div
      className={styles.toast}
      data-kind={kind}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={enter}
      onBlur={leave}
    >
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={styles.card}
          data-depth={layer.depth}
          data-tone={layer.kind}
          aria-hidden={layer.depth !== 0}
          inert={layer.depth !== 0}
          ref={layer.depth === 'departing' ? exitRef : undefined}
        >
          <Icon name={layer.kind} />
          <div className={styles.copy}>
            <strong>{layer.title}</strong>
            <p>{layer.message}</p>
          </div>
        </div>
      ))}
      <Button
        className={styles.close}
        variant="icon"
        icon="close"
        aria-label={label}
        onClick={close}
      />
    </div>
  );
}
