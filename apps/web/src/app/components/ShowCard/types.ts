import type { Show } from '@/app/types/show.types';


export interface ShowCardProps {
  show: Show;
  isSaved: boolean;
  isLoading?: boolean;
  isFailed?: boolean;
  onAction: (button: HTMLButtonElement) => void | Promise<unknown>;
}
