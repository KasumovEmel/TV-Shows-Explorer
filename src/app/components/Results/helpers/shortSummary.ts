const limit = 160;

export function shortSummary(html?: string | null): string | undefined {
  if (!html) return;
  // Template contents stay detached: read only text, including decoded HTML entities.
  const template = document.createElement('template');
  template.innerHTML = html;
  const content = template.content;
  content.querySelectorAll('script, style, noscript').forEach((node) => node.remove());
  content.querySelectorAll('p, br, div, li').forEach((node) => node.after(' '));
  const text = content.textContent.replace(/\s+/gu, ' ').trim();
  if (text.length <= limit) return text || undefined;
  const prefix = text.slice(0, limit - 1);
  const lastSpace = text[limit - 1] === ' ' ? prefix.length : prefix.lastIndexOf(' ');
  return (lastSpace > 0 ? prefix.slice(0, lastSpace) : prefix).trimEnd() + '…';
}
