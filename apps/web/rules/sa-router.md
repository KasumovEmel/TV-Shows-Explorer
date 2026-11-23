# Router

- По результату Task или событию UI Presenter решает, нужен ли переход и куда. Router выполняет переход. Оставляй URL и браузерную историю на стороне UI.
- В этом проекте `AppRoutes/usePresenter.ts` читает путь, а `AppRoutes.tsx` выбирает экран. Переход между поиском и избранным инициирует [Presenter шапки](../src/app/components/AppHeader/usePresenter.ts) с учётом View Transitions и настройки уменьшенного движения.
- Сценарий должен работать и при другом способе навигации. Например, добавление сериала в избранное можно выполнить на обоих экранах.

Пример имени флага для [Presenter маршрутов](../src/app/AppRoutes/usePresenter.ts).

```ts
const pathname = () => location.pathname;

export function usePresenter() {
  return { isFavoritesPage: useSyncExternalStore(subscribe, pathname) === '/favorites' };
}
```
