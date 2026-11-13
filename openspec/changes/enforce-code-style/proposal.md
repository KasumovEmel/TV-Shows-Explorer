## Why

Прямой вызов Axios из эндпоинта обходит общий обработчик ошибок запроса.

## What Changes

- Проверять, что эндпоинты приложения запрашивают данные через общий `request()`.

## Capabilities

### Modified Capabilities

- `project-setup` — проверка HTTP-запросов в Oxlint.

## Impact

Конфигурация Oxlint и правила разработки проекта.
