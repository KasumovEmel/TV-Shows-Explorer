import i18next from 'i18next';

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
