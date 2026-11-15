export function addFavorite(id: string, save: (id: string) => Promise<void>) {
  return save(id);
}
