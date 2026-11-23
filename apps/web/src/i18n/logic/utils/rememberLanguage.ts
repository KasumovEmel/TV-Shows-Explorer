import { languageStorageKey } from '../../constants';
import type { Language } from '../../types';


export function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    /* Storage can be disabled. */
  }
}
