import type { languageNames } from './constants';


export type Language = keyof typeof languageNames;

export interface LanguagePreferences {
  stored: string | null;
  languages: readonly string[];
}
