import type { Show } from '@/app/show';


export interface ShowCardProps {
  show: Show;
  animateRemoval?: (button: HTMLButtonElement, update: () => Promise<void>) => Promise<void>;
}
