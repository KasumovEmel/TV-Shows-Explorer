export function readSummaryText(html?: string | null): string {
  if (!html) {
    return '';
  }
  const template = document.createElement('template');
  template.innerHTML = html;
  const content = template.content;
  content.querySelectorAll('script, style, noscript').forEach((node) => node.remove());
  content.querySelectorAll('p, br, div, li').forEach((node) => node.after(' '));

  return content.textContent;
}
