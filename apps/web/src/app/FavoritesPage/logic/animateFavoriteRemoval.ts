import type { FavoriteRemovalParams } from '../../favorites/types';


const pending = new WeakMap<HTMLElement, Promise<void>>();

export function animateFavoriteRemoval({ button, update }: FavoriteRemovalParams) {
  const row = button.closest('li');
  const list = row?.parentElement;
  if (!row || !list) {
    return update();
  }

  const remove = async () => {
    if (
      !row.isConnected ||
      !row.getAnimations ||
      document.hidden ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return update();
    }
    row.style.setProperty('--favorite-height', row.getBoundingClientRect().height + 'px');
    row.dataset.removing = '';
    try {
      // CSS keeps the final frame visible until React commits the confirmed removal.
      await Promise.allSettled(row.getAnimations().map((motion) => motion.finished));
      await update();
    } catch (error) {
      delete row.dataset.removing;
      row.style.removeProperty('--favorite-height');
      throw error;
    }
  };

  // Play confirmed removals in order when several responses arrive together.
  const previous = pending.get(list);
  const current = previous ? previous.then(remove, remove) : remove();
  pending.set(list, current);

  return current;
}
