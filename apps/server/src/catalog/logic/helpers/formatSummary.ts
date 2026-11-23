import { Parser } from 'htmlparser2';

import { shortenSummary } from './shortenSummary';


const skipped = new Set(['script', 'style', 'noscript']);
const blocks = new Set(['br', 'p', 'div', 'li']);

export function formatSummary(html?: string | null) {
  if (!html) {
    return;
  }
  const text: string[] = [];
  let hidden = 0;
  new Parser({
    onopentag(name) {
      if (skipped.has(name)) {
        hidden++;
      }
      if (!hidden && blocks.has(name)) {
        text.push(' ');
      }
    },
    ontext(value) {
      if (!hidden) {
        text.push(value);
      }
    },
    onclosetag(name) {
      if (skipped.has(name)) {
        hidden--;
      }
      if (!hidden && blocks.has(name)) {
        text.push(' ');
      }
    },
  }).end(html);

  return shortenSummary(text.join(''));
}
