import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import { languageNames, preferredLanguage } from './preferences';
import { setLanguage } from './setLanguage';


export async function initializeI18n() {
  await i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: Object.keys(languageNames),
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });
  const language = preferredLanguage();
  if (language !== 'en') {
    await setLanguage(language);
  }
}
