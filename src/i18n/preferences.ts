export const languageNames = { en: 'English', ru: 'Русский' } as const;
export type Language = keyof typeof languageNames;

const storageKey = 'tv-shows-explorer.language';

export function isLanguage(value: string | null): value is Language {
  return value !== null && Object.hasOwn(languageNames, value);
}

export function preferredLanguage(): Language {
  try {
    const stored = localStorage.getItem(storageKey);
    if (isLanguage(stored)) {
      return stored;
    }
  } catch {
    // The browser can disable storage. Its language preferences still apply.
  }

  const languages = navigator.languages.length ? navigator.languages : [navigator.language];
  for (const locale of languages) {
    const base = locale.toLowerCase().split('-')[0];
    if (isLanguage(base)) {
      return base;
    }
  }

  return 'en';
}

export function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // The selected language remains active for the current visit.
  }
}
