import englishFlag from './english.svg';
import russianFlag from './russian.svg';
import { usePresenter } from './usePresenter';


export function LanguagePicker() {
  const { label, russian, pending, toggle } = usePresenter();
  return (
    <button type="button" aria-label={label} title={label} aria-disabled={pending} onClick={toggle}>
      <img src={russian ? russianFlag : englishFlag} width="24" height="16" alt="" />
    </button>
  );
}
