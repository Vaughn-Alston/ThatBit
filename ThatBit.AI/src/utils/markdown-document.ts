export type MarkdownTask = {
  title: string;
  completed: boolean;
};

export type ParsedMarkdownDocument = {
  title: string;
  description: string;
  body: string;
  tasks: MarkdownTask[];
};

function cleanMarkdownText(value: string) {
  return value
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

export function parseMarkdownDocument(markdown: string): ParsedMarkdownDocument {
  const heading = markdown.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/m)?.[1];
  const firstContentLine = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !/^[-*+]\s+\[[ xX]\]\s+/.test(line));
  const title = cleanMarkdownText(
    heading ?? firstContentLine?.replace(/^#{1,6}\s+/, '') ?? 'Untitled document'
  );
  const description = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) =>
      paragraph
        .split(/\r?\n/)
        .filter((line) => !/^\s{0,3}#{1,6}\s+/.test(line) && !/^\s*[-*+]\s+\[[ xX]\]\s+/.test(line))
        .map(cleanMarkdownText)
        .filter((line) => line && line !== title)
        .join(' ')
        .trim()
    )
    .find(Boolean) ?? '';
  const tasks: MarkdownTask[] = [];
  const taskPattern = /^\s*[-*+]\s+\[([ xX])\]\s+(.+?)\s*$/gm;

  for (const match of markdown.matchAll(taskPattern)) {
    tasks.push({
      title: cleanMarkdownText(match[2]),
      completed: match[1].toLowerCase() === 'x',
    });
  }

  return { title, description, body: markdown.trim(), tasks };
}
