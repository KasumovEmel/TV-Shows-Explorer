# CSS Modules

- Держи стили View рядом с компонентом в `styles.module.css`. Подключай классы через `styles`.
- Для цвета, размеров и состояния используй токены проекта. Светлая и тёмная темы предоставляют компонентам одинаковые имена цветовых токенов.
- Скелетон хранится рядом со своим компонентом. Его размеры задавай в CSS Module. Сверяй фокус, контраст и уменьшенное движение с [дизайном компонентов](../../../docs/design/components.md).

Пример из [ChipSkeleton](../src/app/SearchPage/Results/components/ChipSkeleton/styles.module.css).

```css
.chip {
  width: 10ch;
  height: var(--target);
  border-radius: 22px;
  background: var(--skeleton);
}
```
