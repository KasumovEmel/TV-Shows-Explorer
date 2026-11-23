import type { ChangeLanguageParams } from '../types/ChangeLanguageParams';


export async function changeLanguage({ language, apply, remember }: ChangeLanguageParams) {
  const isApplied = await apply(language);
  if (isApplied) {
    remember(language);
  }

  return isApplied;
}
