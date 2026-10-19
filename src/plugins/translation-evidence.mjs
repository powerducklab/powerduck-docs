/** Reject English copies even when only their front matter or headings differ. */
export function hasTranslatedProse(source, translated) {
  const prose = text => text
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/\s+/g, ' ').trim();
  if (source.trim() === translated.trim()) return false;
  const originalProse = prose(source);
  return originalProse ? originalProse !== prose(translated) : source.trim() !== translated.trim();
}
