import type { FavoriteRemovalParams } from '@/app/favorites';
import type { Show } from '@/app/show.types';


export interface ShowCardProps {
  show: Show;
  animateRemoval?: (params: FavoriteRemovalParams) => Promise<void>;
}
