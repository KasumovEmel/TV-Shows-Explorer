import type { Language, LanguagePreferences } from './types';


export const languageNames = { en: 'English', ru: 'Русский' } as const;

function isLanguage(value: string | null): value is Language {
  return value !== null && Object.hasOwn(languageNames, value);
}

export function preferredLanguage({ stored, languages }: LanguagePreferences): Language {
  if (isLanguage(stored)) {
    return stored;
  }
  for (const locale of languages) {
    const base = locale.toLowerCase().split('-')[0];
    if (isLanguage(base)) {
      return base;
    }
  }

  return 'en';
}
