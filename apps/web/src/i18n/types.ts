import type { languageNames } from './preferences';


export type Language = keyof typeof languageNames;

export interface LanguagePreferences {
  stored: string | null;
  languages: readonly string[];
}
