# TV Shows Explorer

Season One ищет сериалы по названию, фильтрует по жанру и сохраняет избранное для анонимного профиля браузера на 30 дней.

## Запуск

Нужны Node.js 24.22.2 или новее и pnpm 12.18.0. Из корня проекта:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Открой адрес Rsbuild. Клиент в `apps/web` проксирует `/api/` на Hono по `127.0.0.1:3001`. Сервер хранит локальную SQLite в `apps/server/data/`. Путь можно задать через `SQLITE_PATH`.

## Разработка

- `pnpm api:generate` обновляет клиент Axios и маршруты Hono по контракту `packages/contracts/openapi.yaml`.
- `pnpm format` форматирует рукописный код. `pnpm check` проверяет генерацию, формат, архитектурные правила и типы обоих приложений.
- `pnpm test:unit` проверяет сервер и Tasks в Node. `pnpm test` запускает Playwright с тестовым TVmaze и временной SQLite. Для первого локального запуска нужен `pnpm --filter @season-one/web exec playwright install chromium`.
- `pnpm build` собирает фронтенд и Node API в соответствующие каталоги dist.
- `pnpm check unit @season-one/server#build browser` запускает граф CI. Turborepo восстанавливает результаты по входным файлам. Playwright использует ту же компиляцию сайта, из которой выпускается публичная точка входа.

Workflow Release проверяет pull request и main. Ручной запуск и теги `release-*` также публикуют проверенную ревизию. Предыдущая автономная версия остаётся в ветке gh-pages. Первоначальная настройка сервера и порядок проверки VPN описаны в [инструкции по публикации](deploy/README.md).
