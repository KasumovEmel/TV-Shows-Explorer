import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import { languageNames, preferredLanguage } from './preferences';

import type { Language } from './preferences';


export async function setLanguage(language: Language) {
  if (language === 'ru' && !i18next.hasResourceBundle('ru', 'translation')) {
    try {
      const { default: ru } = await import(/* webpackChunkName: "locale-ru" */ './locales/ru.json');
      i18next.addResourceBundle('ru', 'translation', ru);
    } catch {
      return false;
    }
  }
  await i18next.changeLanguage(language);
  document.documentElement.lang = language;

  return true;
}

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
