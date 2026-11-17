import type { Language } from '@/i18n/types';


export interface ChangeLanguageParams {
  language: Language;
  apply: (value: Language) => Promise<boolean>;
  remember: (value: Language) => void;
}
