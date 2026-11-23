# Имена в Simple Architecture

- **Task** называется по действию пользователя или системы. Используй глагол в начале и `camelCase`: `selectGenre`, `loadSuggestions`, `removeFavorite`. Имя файла совпадает с именем функции: `logic/tasks/selectGenre.ts`. По имени должно быть понятно, какое действие выполняется.
- **Булева переменная** начинается с отдельного слова `is` в `camelCase`. Это касается локальных переменных, параметров, собственных полей, props и состояния. Назови проверяемый факт: `isSelected`, `isLoading`, `isListEmpty`, `isRetryAllowed`. Сеттер такого поля — `setIsSelected`.
- Сохраняй имена, заданные внешним контрактом. На границе присваивай значению собственное имя с `is`. Например, `const isSuccessful = response.ok` и `disabled={isDisabled}`. Для числа, списка или текста ошибки используй имена по смыслу: `itemCount`, `items`, `errorMessage`.
- **Helper и util** называй по выполняемой операции: `normalizeQuery.ts`, `readPreference.ts`. **Компонент и его папка** используют одно имя в PascalCase: `SearchField/SearchField.tsx`.

```ts
const isListEmpty = items.length === 0;
const isRetryAllowed = Boolean(error) && !isLoading;
const nextCriteria = selectGenre({ criteria, genre });
```
