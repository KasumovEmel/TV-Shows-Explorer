export function removeFavorite(id: string, remove: (id: string) => Promise<void>) {
  return remove(id);
}
