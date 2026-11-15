import type { Language } from '@/i18n/preferences';


export async function changeLanguage(
  language: Language,
  apply: (value: Language) => Promise<boolean>,
  remember: (value: Language) => void,
) {
  const applied = await apply(language);
  if (applied) {
    remember(language);
  }

  return applied;
}
