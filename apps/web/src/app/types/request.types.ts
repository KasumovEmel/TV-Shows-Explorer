export type AbortRequest = () => void;

export interface AbortableRequest<T> {
  parentSignal?: AbortSignal;
  run: (signal: AbortSignal) => Promise<T>;
  onSuccess: (response: { data: T; signal: AbortSignal }) => void;
  onError: (error: unknown) => void;
  onSettled?: () => void;
}
