export function preprocessObsidian(content: string, noteModules?: Record<string, unknown>): string {
  if (!content) return '';
  
  let processed = content;
  
  // Helper to resolve paths like "RAG chunking" to "physics/RAG chunking" if noteModules is passed
  const resolvePath = (target: string) => {
    if (!noteModules) return `physics/${encodeURIComponent(target)}`;
    const keys = Object.keys(noteModules);
    const match = keys.find(k => k.toLowerCase().endsWith(`/${target.toLowerCase()}.md`));
    if (match) {
      return match.replace('/src/_notes/', '').replace('.md', '').split('/').map(encodeURIComponent).join('/');
    }
    return `physics/${encodeURIComponent(target)}`;
  };
  
  // 1. Strip Frontmatter (between --- and --- at the start)
  processed = processed.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  
  // 2. Convert highlights ==text== to <mark>text</mark>
  processed = processed.replace(/==([^=]+)==/g, '<mark class="bg-yellow-200 dark:bg-yellow-500/30 text-inherit px-1 rounded-sm">$1</mark>');
  
  // Handle image/embed Wiki Links ![[Link]]
  processed = processed.replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
    const target = p1.split('|')[0].trim();
    return `[📄 Embedded Note: ${target}](/notes/${resolvePath(target)})`;
  });

  // 3. Convert normal Wiki Links [[Link]] or [[Link|Alias]]
  processed = processed.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    const parts = p1.split('|');
    const target = parts[0].trim();
    const alias = parts.length > 1 ? parts[1].trim() : target;
    return `[${alias}](/notes/${resolvePath(target)})`;
  });

  // 4. Handle tags like #tag if needed
  processed = processed.replace(/(^|\s)#([A-Za-z0-9_-]+)/g, '$1<span class="text-blue-500 dark:text-blue-400 opacity-80 text-sm italic mr-1">#$2</span>');
  
  return processed;
}
