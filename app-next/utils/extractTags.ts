const tagRegex = /(?:^|[^a-zA-Z0-9])(#\w+)/g;

export default function extractTags(str: string): string[] {
  const tags = [];

  let match;
  while ((match = tagRegex.exec(str)) !== null) tags.push(match[1]);

  return tags;
}
