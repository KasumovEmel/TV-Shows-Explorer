import type { Language } from './types';


const key = 'tv-shows-explorer.language';

export function storedLanguage() {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(key, language);
  } catch {
    /* Storage can be disabled. */
  }
}
