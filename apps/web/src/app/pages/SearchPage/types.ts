import type { AccountControls } from '@/app/logic/auth';
import type { PageFavorites } from '@/app/logic/favorites';


export interface SearchPageProps {
  isRestored: boolean;
  favorites: PageFavorites;
  account: AccountControls;
}
