const pending = new WeakMap<HTMLElement, Promise<void>>();

export function animateFavoriteRemoval(button: HTMLButtonElement, update: () => Promise<void>) {
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
    const next = row.nextElementSibling;
    if (next) {
      const distance = row.getBoundingClientRect().top - next.getBoundingClientRect().top;
      list.style.setProperty('--favorite-rise', distance + 'px');
    }
    row.dataset.removing = '';
    try {
      // CSS keeps the final frame visible until React commits the confirmed removal.
      await Promise.allSettled(row.getAnimations().map((motion) => motion.finished));
      await update();
    } finally {
      delete row.dataset.removing;
      list.style.removeProperty('--favorite-rise');
    }
  };

  // Two responses can arrive together. Measure each row after the previous removal.
  const previous = pending.get(list);
  const current = previous ? previous.then(remove, remove) : remove();
  pending.set(list, current);

  return current;
}
