import { usePresenter } from './usePresenter';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import type { LoginPageProps } from './types';

import styles from './styles.module.css';


export function LoginPage(props: LoginPageProps) {
  const { submit, title, emailLabel, buttonLabel } = usePresenter(props);

  return (
    <>
      <div className={styles.header}>
        <AppHeader isLoginPage account={props.account} />
      </div>
      <main className={styles.page}>
        <h1>{title}</h1>
        <form className={styles.form} onSubmit={submit}>
          <label htmlFor="login-email">{emailLabel}</label>
          <input id="login-email" type="email" name="email" autoComplete="email" required />
          <Button type="submit" disabled={props.account.isPending}>
            {buttonLabel}
          </Button>
        </form>
      </main>
    </>
  );
}
