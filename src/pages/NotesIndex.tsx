import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Book, Code, Calculator, Search, Clock, Type, Folder as FolderIcon, Atom, Waves, Sigma, Code2, NotebookPen } from 'lucide-react';
import notesData from '../data/notes.json';

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5" strokeWidth={1.5} />,
  Book: <Book className="w-5 h-5" strokeWidth={1.5} />,
  Code: <Code className="w-5 h-5" strokeWidth={1.5} />,
  Calculator: <Calculator className="w-5 h-5" strokeWidth={1.5} />,
  Atom: <Atom className="w-5 h-5" strokeWidth={1.5} />,
  Waves: <Waves className="w-5 h-5" strokeWidth={1.5} />,
  Sigma: <Sigma className="w-5 h-5" strokeWidth={1.5} />,
  Code2: <Code2 className="w-5 h-5" strokeWidth={1.5} />,
  NotebookPen: <NotebookPen className="w-5 h-5" strokeWidth={1.5} />
};

const rawNoteModules = import.meta.glob('/src/_notes/**/*.md', { query: '?raw', import: 'default', eager: true });

function parseNote(path: string, rawContent: string) {
  // path is like /src/_notes/physics/quantum.md
  const parts = path.split('/');
  const filename = parts.pop()?.replace('.md', '') || 'untitled';
  const folder = parts.pop() || 'unknown';
  
  let fmTitle = '';
  let fmDateStr = '';
  let fmDescription = '';

  // 1. Parse YAML Frontmatter (between --- and ---)
  const fmMatch = rawContent.match(/^\s*---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const lines = fmMatch[1].split(/\r?\n/);
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        let val = line.slice(colonIdx + 1).trim();
        // strip quotes if any
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        
        if (key === 'about' || key === 'description') fmDescription = val;
        if (key === 'title') fmTitle = val;
        if (key === 'date') fmDateStr = val;
      }
    }
  }

  // 2. Fallbacks if frontmatter isn't present
  const titleMatch = rawContent.match(/^#\s+(.*)/m);
  const title = fmTitle || (titleMatch ? titleMatch[1] : filename.replace(/-/g, ' '));
  
  const dateMatch = rawContent.match(/\*\*Date\s*:\*\*\s*(.*)/i);
  let dateStr = fmDateStr || (dateMatch ? dateMatch[1] : '');
  
  const dateObj = dateStr ? new Date(dateStr) : new Date(0);
  const date = dateObj.getTime() ? dateObj.getTime() : 0;
  
  let description = fmDescription;
  if (!description) {
    const lines = rawContent.split('\n');
    let inFrontmatter = false;
    for (const line of lines) {
      if (line.trim() === '---') {
        inFrontmatter = !inFrontmatter;
        continue;
      }
      if (inFrontmatter) continue;
      
      if (line.trim() && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('$$') && !line.startsWith('-')) {
        description = line.slice(0, 150);
        if (line.length > 150) description += '...';
        break;
      }
    }
  }

  // Formatting date for display
  let displayDate = dateStr;
  if (date) {
    displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  return {
    path: `${folder}/${filename}`,
    folder,
    title,
    date,
    dateStr: displayDate, // use standard formatted date
    description
  };
}

const allNotes = Object.entries(rawNoteModules).map(([path, content]) => parseNote(path, content as string));

export default function NotesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderFilter = searchParams.get('folder');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetic'>('recent');

  const filteredAndSortedNotes = useMemo(() => {
    return allNotes
      .filter(note => {
        if (folderFilter && note.folder !== folderFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return note.title.toLowerCase().includes(q) || note.description.toLowerCase().includes(q) || note.folder.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'alphabetic') return a.title.localeCompare(b.title);
        return b.date - a.date;
      });
  }, [folderFilter, searchQuery, sortBy]);

  return (
    <div className="py-16 md:py-24 px-8 md:px-16 mx-auto flex-1 w-full max-w-5xl bg-transparent transition-colors">
      <div className="space-y-12">
        <div className="border-b border-theme-border/50 pb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-theme-text dark:text-white mb-6 tracking-tight">
            Notebooks
          </h1>
          <p className="text-[17px] text-theme-text-secondary dark:text-[#a1a1aa] font-medium max-w-2xl leading-relaxed">
            A collection of my notes and summaries across different subjects.
          </p>
        </div>

        {/* Folders Section */}
        {!folderFilter && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-[11px] font-semibold text-theme-text-muted dark:text-[#71717a] uppercase tracking-widest mb-6">Subject Folders</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {notesData.map((folderConfig, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSearchParams({ folder: folderConfig.folder })}
                  className="flex items-start gap-4 p-5 border border-theme-border/70 rounded-2xl bg-theme-sidebar/30 hover:bg-theme-sidebar hover:-translate-y-1 hover:shadow-sm dark:hover:shadow-black/20 hover:border-[var(--color-theme-border)] transition-all duration-300 group text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${folderConfig.bg.replace('50', '500/10').replace('900/20', '500/10')} ${folderConfig.color.replace('600', '500').replace('text-', 'border-')}/30 transform group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    <div className={`${folderConfig.color} dark:${folderConfig.color.replace('600', '400')}`}>
                      {iconMap[folderConfig.icon] || <FolderIcon className="w-5 h-5" strokeWidth={1.5} />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-theme-text dark:text-gray-100 mb-1 group-hover:text-theme-accent transition-colors">
                      {folderConfig.title}
                    </h3>
                    <p className="text-[13px] text-theme-text-secondary dark:text-[#a1a1aa] line-clamp-2">
                      {folderConfig.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar: Search & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border/50 pb-6">
          <div className="flex items-center gap-3">
            {folderFilter && (
              <button 
                onClick={() => setSearchParams({})}
                className="text-sm text-theme-text-secondary hover:text-theme-text dark:hover:text-white transition-colors"
              >
                &larr; All Notes
              </button>
            )}
            <h2 className="text-[11px] font-semibold text-theme-text-muted dark:text-[#71717a] uppercase tracking-widest">
              {folderFilter ? `${folderFilter} Notes` : 'All Notes'}
            </h2>
            <span className="bg-theme-sidebar/50 text-theme-text-muted py-0.5 px-2.5 border border-theme-border/50 rounded-full text-xs font-mono">
              {filteredAndSortedNotes.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-theme-sidebar/50 dark:bg-[#18181b] border border-theme-border/50 rounded-md text-[13px] text-theme-text dark:text-white placeholder-theme-text-muted focus:outline-none focus:border-theme-accent transition-all font-sans"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-theme-text-muted" />
            </div>

            {/* Sort */}
            <div className="flex bg-theme-sidebar dark:bg-[#18181b] p-1 rounded-md border border-theme-border/50 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setSortBy('recent')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-sm transition-all duration-200 ${sortBy === 'recent' ? 'bg-theme-card dark:bg-[#27272a] text-theme-text dark:text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text dark:hover:text-[#e4e4e7]'}`}
              >
                <Clock size={14} />
                Recent
              </button>
              <button
                onClick={() => setSortBy('alphabetic')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-sm transition-all duration-200 ${sortBy === 'alphabetic' ? 'bg-theme-card dark:bg-[#27272a] text-theme-text dark:text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text dark:hover:text-[#e4e4e7]'}`}
              >
                <Type size={14} />
                A-Z
              </button>
            </div>
          </div>
        </div>

        {/* Note List */}
        <div className="grid sm:grid-cols-2 gap-5 pb-12">
          {filteredAndSortedNotes.map((note, idx) => (
            <Link key={idx} to={`/notes/${note.path}`} className="flex flex-col p-6 border border-theme-border/70 bg-theme-sidebar/30 hover:bg-theme-sidebar rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[var(--color-theme-border)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-sm">
                  {note.folder}
                </span>
                {note.dateStr && (
                  <span className="text-[11px] font-mono text-theme-text-muted">
                    {note.dateStr}
                  </span>
                )}
              </div>
              <h3 className="text-[17px] font-semibold text-theme-text dark:text-gray-100 mb-2 group-hover:text-theme-accent transition-colors leading-snug">
                {note.title}
              </h3>
              <p className="text-[13.5px] text-theme-text-secondary dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                {note.description || "No description available."}
              </p>
            </Link>
          ))}
          {filteredAndSortedNotes.length === 0 && (
            <div className="col-span-1 sm:col-span-2 text-center py-12 text-theme-text-secondary italic text-sm border border-dashed border-theme-border rounded-2xl">
              No notes found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
