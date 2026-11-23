import { isLanguage } from './isLanguage';
import type { Language, LanguagePreferences } from '../../types';


export function getPreferredLanguage({ stored, languages }: LanguagePreferences): Language {
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
