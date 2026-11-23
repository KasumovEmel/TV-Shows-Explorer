# Interactor / Tasks

- Один сценарий — обычная функция. Глагол ставь первым в имени, используй camelCase, назови файл так же: `logic/tasks/selectGenre.ts`. Её можно вызвать в тесте вне React. Для нескольких параметров своей функции используй один объект.
- В Task описывай шаги сценария и возвращай результат потребителю. Чистое вспомогательное преобразование выноси в helper. Presenter владеет состоянием формы, сообщениями пользователю и выбором перехода.
- Для HTTP используй проектную операцию API через общий `request()`. Task может принимать эту операцию как зависимость. Выделяй дополнительный адаптер, когда он скрывает сложность или переиспользуется.
- У владельца сценария даже первую Task клади в `logic/tasks/`. Общие сценарии избранного для двух экранов лежат в `app/logic/favorites/tasks/`.

Пример продуктового правила из [selectGenre](../../../apps/web/src/app/pages/SearchPage/search/logic/tasks/selectGenre.ts). Смена жанра возвращает поиск на первую страницу.

```ts
export function selectGenre({ criteria, genre }: SelectGenreParams): SearchCriteria {
  return { ...criteria, genre: genre || undefined, page: 1 };
}
```
