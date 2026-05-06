import { Link } from 'react-router-dom';
import { ArrowRight, Book, ArrowUpRight, Atom, Waves, Sigma, Code2, NotebookPen } from 'lucide-react';

const rawPostModules = import.meta.glob('/src/_posts/**/*.md', { query: '?raw', import: 'default', eager: true });

function parsePost(path: string, rawContent: string) {
  const parts = path.split('/');
  const filename = parts.pop()?.replace('.md', '') || 'untitled';
  const folder = parts.pop() || 'unknown';
  
  let fmTitle = '';
  let fmDateStr = '';
  let fmDescription = '';

  // 1. Parse YAML Frontmatter (between --- and ---)
  const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const lines = fmMatch[1].split('\n');
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
  
  const dateMatch = rawContent.match(/\*\*Date\s*:\*\*\s*(.*)/i) || rawContent.match(/Date:\s*(.*)/i);
  let dateStr = fmDateStr || (dateMatch ? dateMatch[1] : '');
  
  if (!dateStr) {
    const patternMatch = rawContent.match(/\d{4}-\d{2}-\d{2}/);
    if (patternMatch) dateStr = patternMatch[0];
  }
  
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

  // Formatting date for display: "May 05, 2026"
  let displayDate = dateStr;
  if (date) {
    displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  return {
    path: `${folder}/${filename}`,
    folder,
    title,
    date,
    displayDate: displayDate || 'No Date',
    description
  };
}

const allPosts = Object.entries(rawPostModules).map(([path, content]) => parsePost(path, content as string));
const recentPosts = [...allPosts].sort((a, b) => b.date - a.date).slice(0, 6);

export default function Home() {
  return (
    <div className="py-16 md:py-24 px-8 md:px-16 max-w-5xl mx-auto flex-1 w-full bg-transparent transition-colors">
      <div className="space-y-12">
        <div className="border-b border-theme-border/50 pb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-theme-text dark:text-white mb-6 tracking-tight">
            Hi, I'm <span className="text-blue-500 dark:text-[#58a6ff]">Pranav Shinde</span>.
          </h1>
          <p className="text-[17px] text-theme-text-secondary dark:text-[#a1a1aa] font-medium leading-relaxed max-w-2xl">
            Physics student working in Quantum Computing, Machine Learning, Numerical Methods, and Scientific Computing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pb-12">
            <div className="p-5 border border-theme-border rounded-2xl bg-theme-sidebar/50 hover:bg-theme-card hover:border-[var(--color-theme-border)] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <Atom className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-sm mb-2 text-theme-text dark:text-gray-100">Quantum Computing</h3>
                <p className="text-theme-text-secondary dark:text-[#a1a1aa] text-[13px] leading-relaxed">Exploring quantum algorithms, kernel methods, and hardware-efficient ansatzes.</p>
            </div>
            
            <div className="p-5 border border-theme-border rounded-2xl bg-theme-sidebar/50 hover:bg-theme-card hover:border-[var(--color-theme-border)] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm mb-2 text-theme-text dark:text-gray-100">Machine Learning</h3>
                <p className="text-theme-text-secondary dark:text-[#a1a1aa] text-[13px] leading-relaxed">Applying ML to physics, parameter optimization, and complex dataset modeling.</p>
            </div>
            
            <div className="p-5 border border-theme-border rounded-2xl bg-theme-sidebar/50 hover:bg-theme-card hover:border-[var(--color-theme-border)] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                  <Sigma className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-sm mb-2 text-theme-text dark:text-gray-100">Numerical Methods</h3>
                <p className="text-theme-text-secondary dark:text-[#a1a1aa] text-[13px] leading-relaxed">Computational approaches to solving theoretical models and simulations.</p>
            </div>
            
            <Link to="/notes" className="group p-5 border border-blue-500/20 dark:border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <NotebookPen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">Notebooks</h3>
                  <p className="text-blue-800/80 dark:text-blue-200/70 text-[13px] leading-relaxed">Read my structured notes across different subjects, including Non-Equilibrium Physics.</p>
                </div>
                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wide uppercase">
                  Explore notes <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
        </div>

        <div>
           <h2 className="text-xs font-semibold text-theme-text-muted dark:text-[#71717a] uppercase tracking-widest mb-6">Recent Posts</h2>
          <div className="space-y-3">
            {recentPosts.map((post, idx) => (
              <Link key={idx} to={`/posts/${post.path}`} className="group block cursor-pointer flex flex-col md:flex-row md:items-center gap-4 p-4 border border-theme-border/50 bg-theme-sidebar/30 hover:bg-theme-sidebar rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-[var(--color-theme-border)]">
                <span className="text-[13px] font-mono text-theme-text-muted shrink-0 md:w-32">{post.displayDate}</span>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-theme-text dark:text-gray-100 group-hover:text-theme-accent transition-colors flex items-center gap-2 mb-1.5">
                      {post.title}
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-theme-accent" />
                  </h3>
                  <p className="text-theme-text-secondary dark:text-[#a1a1aa] text-[13px] leading-relaxed">{post.description || 'No description'}</p>
                </div>
              </Link>
            ))}
            {recentPosts.length === 0 && (
              <div className="text-center py-8 text-theme-text-muted dark:text-[#8b949e] italic text-sm">
                No recent posts found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
