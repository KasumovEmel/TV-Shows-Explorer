import type { ChangeLanguageParams } from '../types';


export async function changeLanguage({ language, apply, remember }: ChangeLanguageParams) {
  const applied = await apply(language);
  if (applied) {
    remember(language);
  }

  return applied;
}
