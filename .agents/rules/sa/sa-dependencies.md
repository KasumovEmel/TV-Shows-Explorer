# Зависимости

- Направляй зависимости от часто меняющегося кода к устойчивому контракту. Проверяй новые импорты на прямые и косвенные циклы.
- View задаёт удобные ей поля и обработчики. Presenter их предоставляет. Presenter может прямо импортировать Task. Потребитель Task задаёт нужные ему вход и результат.
- Внутренние файлы компонента доступны его владельцу. Родитель подключает ребёнка через `index.ts`. Общему дочернему UI передавай данные вниз через props, события возвращай через callbacks.
- Если двум соседним веткам потребовалась одна функция, подними её к общему владельцу. Общий компонент подключай через его публичный алиас, например `@components/Button`.

В [useSearchPage](../../../apps/web/src/app/pages/SearchPage/search/logic/hooks/useSearchPage.ts) хук связывает Task с HTTP-операцией. Тест может подставить функцию с тем же контрактом.

```ts
// В logic/hooks/useSearchPage.ts
import { loadSearchPage } from '../tasks/loadSearchPage';
import { searchShows } from '@/api/generated/catalog';

// В Presenter или его хуке, когда criteria и signal уже известны.
const fetchPage = () => loadSearchPage({ criteria, signal, requestPage: searchShows });
```

Смена транспорта относится к реализации загрузки. Перенос запуска с открытия экрана на кнопку относится к Presenter.
