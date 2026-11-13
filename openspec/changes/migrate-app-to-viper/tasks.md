# Tasks

До переноса `pnpm check` прошёл, все 42 браузерных теста `pnpm test` прошли.

## 1. Выделить маршрут без изменения поведения

- [x] 1.1 До переноса выполнить `pnpm check` и `pnpm test`. Зафиксировать исходный результат, чтобы отличать существующие сбои от внесённых миграцией.
- [x] 1.2 Выделить `src/app/SearchPage/{index.ts,SearchPage.tsx,usePresenter.ts,types.ts}`. Перенести `Search`, `Results` и их ресурсы под маршрут, а два корневых поисковых хука — в `SearchPage/logic/hooks/`. Перенести тип пропсов маршрута из `Search`. Проверить `pnpm build`: `src/index.tsx` по-прежнему запускает публичный `App`, который подключает маршрут через его `index.ts`.
- [x] 1.3 Сохранить один экземпляр поля при перемещении в шапку и слот `App.children` для тестовой сборки. Обновить ссылки на экран и его блоки в README; проверить обе ссылки и выполнить `pnpm exec playwright test startup search-transition recovery`.

## 2. Закрепить запрос и жанр за их Presenter

- [x] 2.1 Подключить `useSearchQuery` в `SearchPage/usePresenter.ts`. Хранить в нём текст поля и подтверждённый запрос, передавать последний в `Results` через пропсы. Через `search-request.spec.ts` проверить подтверждение по Enter и после паузы в 300 мс, число запросов и очистку при запоздалом ответе. Через `search-transition.spec.ts` проверить фокус и переход поля.
- [x] 2.2 Оставить выбор жанра и его обработчик в `Results/usePresenter.ts`. Сохранить привязку `Results` к нормализованному тексту и сброс пагинации при выборе жанра. Через `search-paging.spec.ts` проверить жанр последнего сериала и возврат к первой группе, через `recovery.spec.ts` — пустое поле после восстановления.

## 3. Выделить сценарии выдачи и локализовать её компоненты

- [x] 3.1 Перенести эндпоинт и DTO в `Results/logic/api/`, модель `Show` — в `Results/logic/show.ts`. Выделить `searchShows(query)` и вызывать её из загрузчика SWR в Presenter выдачи. SWR кеширует ответы TVmaze по ключу запроса. Проверить в `search-request.spec.ts` и `api-errors.spec.ts` ручной повтор после 503, обработку ошибки сети и предупреждение при 429 с сохранёнными карточками.
- [x] 3.2 Разделить преобразование TVmaze: разбор HTML оставить в утилите адаптера, нормализацию сущности и сокращение текста — в чистых helpers. Проверить `show-details.spec.ts`: декодирование сущностей, сокращение по словам до 160 знаков, пропуски и рейтинг 0.
- [x] 3.3 Выделить `filterShows(shows, genre)` в `Results/logic/tasks/` и вычисление групп по три — в `PagedResults/logic/`. Проверить прямыми вызовами без React уникальные жанры всей выдачи, порядок карточек и группы 3 + 3 + 1. Оставить создание подписей, обработчики выбора и текущую видимую страницу в Presenter.
- [x] 3.4 Переместить `PagedResults` непосредственно в `Results/`, `ShowCardLayout` и плиточные стили — к `PagedResults`, `usePageScroll` и `usePageViewport` — в его `logic/hooks/`. Проверить через `search-layout`, `results-toolbar`, `scroll-current-page` и `search-paging`: геометрию, скелетоны, прокрутку и переход с клавиатуры без дублей.

## 4. Разместить оболочку и общий UI по владельцам

- [x] 4.1 Перенести `Button`, `Icon`, `Brand` в `app/components/`; `AppSWRConfig`, `ErrorBoundary` и `NotificationProvider` — на уровень `App`. Обновить публичные импорты, включая `tests/browser/{fixture.tsx,notify.ts,notification-layout.spec.ts}`, и ссылки README. Проверить `pnpm check`, `pnpm test:shell` и `api-errors.spec.ts`; инфраструктура в `shared` не импортирует `app`.
- [x] 4.2 Подключать существующий `useTheme` из корневого Presenter; выделить `LanguagePicker/logic/changeLanguage.ts` для применения языка и сохранения успешного выбора. Отделить импорт React-плагина i18next от функций, используемых task. Проверить через `preferences.spec.ts`, `startup.spec.ts` и `recovery.spec.ts`: ленивый русский словарь, сохранение выбора и выдачи, тема запасного экрана.
- [x] 4.3 Разместить типы событий у `NotificationProvider`, вынести правило очереди из хука, единственный вспомогательный хук таймера — в `Notification/logic/useDismissTimer.ts`. Сохранить публичный `useNotify`. Проверить `notification-queue.spec.ts` и `notification-layout.spec.ts`: объединение повтора, порядок, паузу таймера, возврат фокуса и размещение сообщения.

## 5. Принять миграцию

- [x] 5.1 Сверить итоговое дерево с [дизайном](design.md): у Tasks нет зависимостей от React, SWR-хуков, роутера и компонентов; одиночные файлы не обёрнуты в папки категорий. Проверить импорты и ссылки на прежние `app/components/Search`, `app/components/Results`, `shared/components` и `shared/types/show` в исходниках, тестах и README.
- [x] 5.2 Запустить `pnpm check`, `pnpm build`, полный `pnpm test` и `pnpm exec openspec validate --all --strict`. Сопоставить с исходным прогоном: проверки проходят, продуктовые сценарии не ослаблены, адреса и зависимости приложения не изменились.
