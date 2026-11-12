import type { ShowCardProps } from './types';
export function usePresenter(props: ShowCardProps) {
  return { ...props, original: props.title !== props.originalTitle ? props.originalTitle : null };
}
