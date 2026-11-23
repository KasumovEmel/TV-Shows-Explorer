import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { languageNames } from './constants';
import en from './locales/en.json';
import { getPreferredLanguage } from './logic/helpers/getPreferredLanguage';
import { readStoredLanguage } from './logic/utils/readStoredLanguage';
import { setLanguage } from './logic/utils/setLanguage';


export async function initializeI18n() {
  await i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: Object.keys(languageNames),
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });
  const language = getPreferredLanguage({
    stored: readStoredLanguage(),
    languages: navigator.languages.length ? navigator.languages : [navigator.language],
  });
  if (language !== 'en') {
    await setLanguage(language);
  }
}

export { rememberLanguage } from './logic/utils/rememberLanguage';
export type { Language } from './types';
export { setLanguage };
