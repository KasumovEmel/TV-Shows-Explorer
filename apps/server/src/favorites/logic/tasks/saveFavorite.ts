import type { SaveFavoriteParams } from '../types/SaveFavoriteParams';


export async function saveFavorite({ store, session, id, loadShow }: SaveFavoriteParams) {
  if (store.has({ session, id })) {
    return;
  }
  store.insert({ session, show: await loadShow(id) });
}
