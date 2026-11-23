import { languageNames } from '../../constants';
import type { Language } from '../../types';


export function isLanguage(value: string | null): value is Language {
  return value !== null && Object.hasOwn(languageNames, value);
}
