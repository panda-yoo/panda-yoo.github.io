import { useLocation, useOutletContext, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { useEffect, useState } from 'react';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { preprocessObsidian } from '../lib/obsidian';
import { useTheme } from '../components/ThemeProvider';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const { theme } = useTheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group my-8 overflow-hidden rounded-xl border border-[#BFCBDA] dark:border-theme-border/70 bg-[#E2EAF3] dark:bg-[#1E1E1E] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex items-center justify-between px-4 py-2 bg-theme-sidebar/50 dark:bg-[#161b22] border-b border-theme-border/50 text-xs text-theme-text-muted font-mono uppercase tracking-wider">
          <span>{match[1]}</span>
          <button 
            onClick={handleCopy}
            className="p-1 hover:text-theme-text transition-colors rounded-sm ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Copy code"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <SyntaxHighlighter
          children={codeString}
          style={isDark ? (vscDarkPlus as any) : (oneLight as any)}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent'
            }
          }}
          {...props}
        />
      </div>
    );
  }
  return (
    <code className={`${className} bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-mono text-[0.9em]`} {...props}>
      {children}
    </code>
  );
};

// Dynamically import all raw markdown notes
const noteModules = import.meta.glob('/src/_notes/**/*.md', { query: '?raw', import: 'default', eager: true });

export default function Notes() {
  const location = useLocation();
  const { setScrollProgress } = useOutletContext<{ setScrollProgress: (p: number) => void }>();
  const pathParts = location.pathname.split('/notes/');
  const firstKey = Object.keys(noteModules)[0];
  let defaultNote = firstKey ? firstKey.replace('/src/_notes/', '').replace('.md', '') : '';
  let currentPath = (pathParts.length > 1 && pathParts[1]) ? decodeURIComponent(pathParts[1]) : defaultNote;
  
  const markdownKey = `/src/_notes/${currentPath}.md`;
  const rawMarkdown = (noteModules[markdownKey] as string) || '# Note not found.\n\nThe requested note does not exist.';
  const markdownContent = preprocessObsidian(rawMarkdown, noteModules);

  // Extract headings for Sidebar (H1 and H2)
  const headings: {level: number, text: string, id: string}[] = [];
  const lines = markdownContent.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({
        level: match[1].length, // 1 for #, 2 for ##, 3 for ###
        text: text,
        id: id
      });
    }
  });

  const h1Text = headings.find(h => h.level === 1)?.text || 'Untitled Note';
  const subheadings = headings; // Use all H1, H2, H3 headings in the sidebar

  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Update global progress bar
    if (scrollHeight > clientHeight) {
      setScrollProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    } else {
      setScrollProgress(0);
    }

    // ScrollSpy Logic
    const headingElements = subheadings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    let currentActiveId = '';
    
    // Adding an offset so we update slightly before jumping past
    const offset = 80;

    for (const el of headingElements) {
      // get offsetTop relative to the scroll container's content
      if (el.offsetTop - offset <= scrollTop) {
        currentActiveId = el.id;
      }
    }

    if (currentActiveId && currentActiveId !== activeId) {
      setActiveId(currentActiveId);
    }
  };

  useEffect(() => {
    // reset scroll when nav changes
    const container = document.getElementById('notes-scroll-container');
    if (container) {
      container.scrollTo(0, 0);
      setScrollProgress(0);
      setActiveId('');
    }
  }, [location.pathname]);

  return (
    <div 
      className="flex w-full h-full bg-transparent transition-colors relative overflow-y-auto"
      id="notes-scroll-container"
      onScroll={handleScroll}
    >
      {/* Content Viewport */}
      <div className="flex-1 pb-32">
        <article className="p-8 lg:p-12 min-w-0 max-w-4xl mx-auto">
          <header className="mb-10">
            <nav className="text-xs text-theme-text-muted flex items-center mb-4">
              <Link to="/notes" className="hover:text-theme-text dark:hover:text-white transition-colors">Notebooks</Link>
              {currentPath.split('/').map((part, idx, arr) => {
                const isLast = idx === arr.length - 1;
                return (
                  <span key={idx} className="flex items-center">
                    <span className="mx-2">/</span>
                    {isLast ? (
                      <span className="text-theme-text dark:text-[#c9d1d9] font-medium">
                        {part.toUpperCase().replace(/-/g, ' ')}
                      </span>
                    ) : (
                      <Link 
                        to={`/notes?folder=${part}`} 
                        className="hover:text-theme-text dark:hover:text-white transition-colors"
                      >
                        {part.toUpperCase().replace(/-/g, ' ')}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
            <h1 className="text-4xl font-light text-zinc-900 dark:text-white">{h1Text}</h1>
          </header>
          
          <div className="prose prose-zinc dark:prose-invert max-w-none 
              prose-headings:font-semibold prose-headings:text-theme-text dark:prose-headings:text-white prose-headings:tracking-tight 
              prose-h1:hidden
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-theme-border/50
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
              prose-a:text-theme-accent dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-p:leading-8 prose-p:text-theme-text-secondary dark:prose-p:text-[#a1a1aa] prose-p:text-[1.05rem]
              prose-li:leading-7 prose-li:marker:text-theme-text-muted prose-li:text-[1.05rem] prose-li:text-theme-text-secondary dark:prose-li:text-[#a1a1aa]
              prose-strong:text-theme-text dark:prose-strong:text-white prose-strong:font-semibold
              prose-hr:my-12 prose-hr:border-theme-border/50
              prose-blockquote:border-l-[4px] prose-blockquote:border-theme-border dark:prose-blockquote:border-white/20 prose-blockquote:bg-theme-sidebar/30 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-theme-text-secondary dark:prose-blockquote:text-[#a1a1aa] prose-blockquote:rounded-r-lg
              prose-pre:bg-[#0E0E11] prose-pre:border prose-pre:border-theme-border/30 prose-pre:rounded-lg
              prose-code:font-mono prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none prose-code:bg-transparent prose-code:text-inherit
              prose-table:border-collapse prose-table:w-full prose-td:p-3 prose-th:p-3 prose-th:bg-theme-sidebar/50 dark:prose-th:bg-[#18181b] prose-th:border-b prose-th:border-theme-border/50 prose-td:border-b prose-td:border-theme-border/30">
            <Markdown 
              remarkPlugins={[remarkMath, remarkGfm]} 
              rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
              components={{
                pre: ({ children }: any) => <>{children}</>,
                code: CodeBlock,
                a: ({ href, children, ...props }: any) => {
                  if (href?.startsWith('#')) {
                    return (
                      <a 
                        href={href} 
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(href.slice(1));
                          if (target) {
                            const container = document.getElementById('notes-scroll-container');
                            if (container) {
                              container.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                            }
                          }
                        }}
                      >
                        {children}
                      </a>
                    );
                  }
                  return <a href={href} {...props}>{children}</a>;
                }
              }}
            >
              {markdownContent}
            </Markdown>
          </div>
        </article>
      </div>

      {/* Right Interaction Panel - Fully Static! */}
      <aside className="w-72 bg-theme-sidebar dark:bg-[#161b22] border-l border-theme-border dark:border-[#30363d] flex-col hidden xl:flex shrink-0 h-screen sticky top-0 overflow-y-auto pt-10">
        <section className="flex-1 px-8 pb-8">
          <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-[#c9d1d9] mb-4">On this page</h4>
          <ul className="flex flex-col w-full relative border-l border-zinc-200 dark:border-[#30363d]">
            {subheadings.map((sh, idx) => {
              const isActive = activeId === sh.id;
              
              // indentation based on level
              let plClass = 'pl-4';
              if (sh.level === 2) plClass = 'pl-8';
              else if (sh.level === 3) plClass = 'pl-12';

              return (
                <li key={idx} className="w-full relative">
                  {isActive && (
                    <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-blue-600 dark:bg-white z-10" />
                  )}
                  <a 
                    href={`#${sh.id}`}
                    className={`block w-full py-2 pr-2 ${plClass} transition-colors text-[13px] leading-relaxed ${
                      isActive 
                        ? 'text-zinc-900 dark:text-white font-semibold' 
                        : 'text-zinc-600 dark:text-[#8b949e] hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(sh.id);
                      if (element) {
                        const container = document.getElementById('notes-scroll-container');
                        if (container) {
                          container.scrollTo({
                            top: element.offsetTop - 40,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }}
                  >
                    {sh.text.replace(/\*\*/g, '').replace(/\$/g, '')}
                  </a>
                </li>
              );
            })}
            {subheadings.length === 0 && (
              <li className="text-[13px] text-zinc-500 dark:text-[#8b949e] italic pl-4 py-2">No subsections generated</li>
            )}
          </ul>
        </section>

        <div className="mt-auto p-6 border-t border-theme-border/50 bg-theme-sidebar">
          <Link to="/notes" className="flex items-center justify-between p-3 border border-theme-border/50 rounded-lg hover:bg-theme-sidebar-hover transition-colors group">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-theme-text-muted tracking-wider mb-0.5">Next Module</span>
              <span className="text-[13px] font-medium text-theme-text group-hover:text-theme-accent transition-colors">All Notes</span>
            </div>
            <div className="text-theme-text-muted group-hover:text-theme-accent transition-transform group-hover:translate-x-1">→</div>
          </Link>
        </div>
      </aside>
    </div>
  );
}
