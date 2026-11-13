import { rememberLanguage } from '@/i18n/preferences';
import { setLanguage } from '@/i18n/setLanguage';
import type { Language } from '@/i18n/preferences';


export async function changeLanguage(language: Language) {
  const applied = await setLanguage(language);
  if (applied) {
    rememberLanguage(language);
  }

  return applied;
}
