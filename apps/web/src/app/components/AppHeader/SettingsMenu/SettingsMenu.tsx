import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import type { SettingsMenuProps } from './types';

import styles from './styles.module.css';


export function SettingsMenu(props: SettingsMenuProps) {
  const {
    root,
    trigger,
    isOpen,
    panelId,
    menuLabel,
    logoutLabel,
    toggle,
    onBlur,
    onKeyDown,
    logout,
  } = usePresenter(props);

  return (
    <div ref={root} className={styles.menu} onBlur={onBlur} onKeyDown={onKeyDown}>
      <Button
        ref={trigger}
        variant="framedIcon"
        isTransparent
        icon="more"
        aria-label={menuLabel}
        title={menuLabel}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      />
      <div
        className={styles.panel}
        id={panelId}
        hidden={!isOpen}
        role="group"
        aria-label={menuLabel}
      >
        {isOpen && (
          <>
            {props.children}
            {props.account.email && (
              <div className={styles.footer}>
                <button type="button" disabled={props.account.isPending} onClick={logout}>
                  <Icon name="logout" size={19} />
                  {logoutLabel}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
