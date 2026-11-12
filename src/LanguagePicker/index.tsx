import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../i18n';
import { isLanguage, languageNames, rememberLanguage, type Language } from '../i18n/preferences';
import styles from './styles.module.css';

export function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const [pending, setPending] = useState<Language | null>(null);
  const [failed, setFailed] = useState(false);

  async function select(value: string) {
    if (!isLanguage(value)) return;
    setPending(value);
    setFailed(false);
    const loaded = await setLanguage(value);
    if (loaded) rememberLanguage(value);
    setFailed(!loaded);
    setPending(null);
  }

  return (
    <div className={styles.picker}>
      <label>
        {t('language.label')}
        <select
          value={pending ?? i18n.resolvedLanguage}
          disabled={pending !== null}
          onChange={(event) => void select(event.target.value)}
        >
          {Object.entries(languageNames).map(([code, name]) => (
            <option key={code} value={code} lang={code}>
              {name}
            </option>
          ))}
        </select>
      </label>
      {failed && <span role="alert">{t('language.loadError')}</span>}
    </div>
  );
}
