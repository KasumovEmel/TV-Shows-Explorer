import assert from 'node:assert/strict';
import test from 'node:test';

import { runAbortableRequest } from '../src/app/utils/runAbortableRequest';


void test('отменённый родительский сигнал пропускает запрос', async (t) => {
  const run = t.mock.fn(() => Promise.resolve('result'));
  const callback = t.mock.fn();
  const { finished } = runAbortableRequest({
    parentSignal: AbortSignal.abort(),
    run,
    onSuccess: callback,
    onError: callback,
    onSettled: callback,
  });
  assert.equal(await finished, false);
  assert.equal(run.mock.callCount(), 0);
  assert.equal(callback.mock.callCount(), 0);
});

void test('локальная отмена игнорирует поздний результат и оставляет родителя активным', async (t) => {
  const parent = new AbortController();
  const callback = t.mock.fn();
  const run = t.mock.fn(async (_signal: AbortSignal) => 'result');
  const { abort, finished } = runAbortableRequest({
    parentSignal: parent.signal,
    run,
    onSuccess: callback,
    onError: callback,
    onSettled: callback,
  });
  abort();
  assert.equal(run.mock.calls[0].arguments[0].aborted, true);
  assert.equal(parent.signal.aborted, false);
  assert.equal(await finished, false);
  assert.equal(callback.mock.callCount(), 0);
});

void test('отмена родителем до обработки ошибки прерывает запрос без уведомления', async (t) => {
  const parent = new AbortController();
  const callback = t.mock.fn();
  const run = t.mock.fn((_signal: AbortSignal) => Promise.reject(new Error('offline')));
  const { finished } = runAbortableRequest({
    parentSignal: parent.signal,
    run,
    onSuccess: callback,
    onError: callback,
    onSettled: callback,
  });
  parent.abort();
  assert.equal(run.mock.calls[0].arguments[0].aborted, true);
  assert.equal(await finished, false);
  assert.equal(callback.mock.callCount(), 0);
});

void test('успешная операция возвращает true после обработки ответа', async () => {
  const events: string[] = [];
  const { finished } = runAbortableRequest({
    run: () => Promise.resolve('result'),
    onSuccess: ({ data }) => events.push(data),
    onError: () => assert.fail('unexpected request failure'),
    onSettled: () => events.push('settled'),
  });
  assert.equal(await finished, true);
  assert.deepEqual(events, ['result', 'settled']);
});

void test('ошибка запроса доставляется обработчику и возвращает false', async (t) => {
  const error = new Error('offline');
  const onError = t.mock.fn();
  const onSuccess = t.mock.fn();
  const { finished } = runAbortableRequest({
    run: () => Promise.reject(error),
    onSuccess,
    onError,
  });
  assert.equal(await finished, false);
  assert.deepEqual(
    onError.mock.calls.map((call) => call.arguments),
    [[error]],
  );
  assert.equal(onSuccess.mock.callCount(), 0);
});
