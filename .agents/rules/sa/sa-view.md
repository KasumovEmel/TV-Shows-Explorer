# View

- Оставляй в View разметку, подключение дочерних компонентов и стилей. Для собственного поведения вызывай один `usePresenter(props)`.
- В JSX выбирай элементы по готовым флагам. Перевод, вычисление `isDisabled`, эффекты, подписку и обработчик с собственной логикой помещай в Presenter.
- Компоненту, который только отображает props, достаточно JSX. Например, `Label` может сразу вернуть `<span>{text}</span>`.

Пример контракта для [GenreChip](../../../apps/web/src/app/pages/SearchPage/Results/components/GenreChip/GenreChip.tsx). Presenter готовит подпись, View задаёт доступную семантику кнопки.

```tsx
export function GenreChip(props: GenreChipProps) {
  const { label, isSelected, select } = usePresenter(props);

  return (
    <Button variant="chip" aria-pressed={isSelected} onClick={select}>
      {label}
    </Button>
  );
}
```
