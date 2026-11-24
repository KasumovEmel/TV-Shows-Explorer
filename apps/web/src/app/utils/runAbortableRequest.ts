import type { AbortableRequest } from '../types/request.types';


export function runAbortableRequest<T>({
  parentSignal,
  run,
  onSuccess,
  onError,
  onSettled,
}: AbortableRequest<T>) {
  const controller = new AbortController();
  const signal = parentSignal
    ? AbortSignal.any([parentSignal, controller.signal])
    : controller.signal;

  async function execute() {
    if (signal.aborted) {
      return false;
    }
    try {
      const data = await run(signal);
      if (signal.aborted) {
        return false;
      }
      onSuccess({ data, signal });

      return true;
    } catch (error) {
      if (!signal.aborted) {
        onError(error);
      }

      return false;
    } finally {
      if (!signal.aborted) {
        onSettled?.();
      }
    }
  }

  return { abort: () => controller.abort(), finished: execute() };
}
