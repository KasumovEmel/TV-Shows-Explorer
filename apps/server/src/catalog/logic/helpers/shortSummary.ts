const limit = 160;

export function shortSummary(summary: string): string | undefined {
  const text = summary.replace(/\s+/gu, ' ').trim();
  if (text.length <= limit) {
    return text || undefined;
  }
  const prefix = text.slice(0, limit - 1);
  const lastSpace = text[limit - 1] === ' ' ? prefix.length : prefix.lastIndexOf(' ');

  return (lastSpace > 0 ? prefix.slice(0, lastSpace) : prefix).trimEnd() + '…';
}
