# TV Shows Explorer

## Технологии

- React, TypeScript и CSS Modules — интерфейс приложения.
- Axios и SWR — поиск сериалов через TVmaze API и кеширование результатов.
- i18next — перевод интерфейса на русский и английский.
- Rsbuild — сборка и локальный сервер; Playwright — браузерные тесты.

## Запуск

Понадобятся Node.js 22.12.0 или новее и pnpm 12.18.0. В корне проекта выполни:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Открой локальный адрес из вывода Rsbuild.
