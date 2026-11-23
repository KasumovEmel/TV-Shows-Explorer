# Router

- По результату Task или событию UI Presenter решает, нужен ли переход и куда. Router выполняет переход. Оставляй URL и браузерную историю на стороне UI.
- В этом проекте Presenter роутера читает путь, а [Router](../../../apps/web/src/app/router/Router.tsx) выбирает экран из `app/pages/`. При открытии избранного поиск остаётся смонтированным и скрытым. Переход инициирует [Presenter шапки](../../../apps/web/src/app/components/AppHeader/usePresenter.ts) с учётом View Transitions и настройки уменьшенного движения.
- Сценарий должен работать и при другом способе навигации. Например, добавление сериала в избранное можно выполнить на обоих экранах.

Пример имени флага для [Presenter роутера](../../../apps/web/src/app/router/usePresenter.ts).

```ts
const pathname = () => location.pathname;

export function usePresenter() {
  return { isFavoritesPage: useSyncExternalStore(subscribe, pathname) === '/favorites' };
}
```
