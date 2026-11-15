# TV Shows Explorer

Поиск сериалов по названию с фильтром по жанру. Избранное доступно в том же браузере 30 дней без регистрации.

## Запуск

Нужны Node.js 24.22.2 или новее, pnpm 12.18.0 и Python 3. Из корня проекта:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Открой адрес, который Rsbuild выведет в терминале.

## Разработка

- `pnpm check` — проверить форматирование, код, типы и соответствие контракту API.
- `pnpm test:unit` — запустить модульные тесты клиента и сервера.
- `pnpm test` — запустить браузерные тесты. Перед первым запуском установи Chromium: `pnpm --filter @season-one/web exec playwright install chromium`.
- `pnpm build` — собрать клиент и сервер.

[Инструкция по публикации](deploy/README.md)
