import type { Show } from '../../../generated/routes.schemas';
import type { FavoritesStore } from '../../FavoritesStore';


export interface SaveFavoriteParams {
  store: Pick<FavoritesStore, 'has' | 'insert'>;
  session: string;
  id: string;
  loadShow: (id: string) => Promise<Show>;
}
