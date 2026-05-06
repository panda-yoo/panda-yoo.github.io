import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Search, Github, BookOpen, Moon, Sun, User, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState, useRef, useEffect } from 'react';

// Dynamically import all notes at build time
const noteModules = import.meta.glob('/src/_notes/**/*.md', { query: '?url', import: 'default', eager: true });
const postModules = import.meta.glob('/src/_posts/**/*.md', { query: '?url', import: 'default', eager: true });

// Since we are reading the structure, let's just get the paths for navigation.
const notePaths = Object.keys(noteModules).map(path => {
  const relativePath = path.replace('/src/_notes/', '').replace('.md', '');
  return relativePath; // e.g. "physics/non-equilibrium"
});
const postPaths = Object.keys(postModules).map(path => {
  return path.replace('/src/_posts/', '').replace('.md', '');
});

// Group paths by folder
const groupedNotes = notePaths.reduce((acc, path) => {
  const parts = path.split('/');
  const folder = parts.length > 1 ? parts[0] : 'general';
  const name = parts[parts.length - 1];
  
  if (!acc[folder]) acc[folder] = [];
  acc[folder].push({ path, name });
  return acc;
}, {} as Record<string, { path: string; name: string }[]>);

const groupedPosts = postPaths.reduce((acc, path) => {
  const parts = path.split('/');
  const folder = parts.length > 1 ? parts[0] : 'blog';
  const name = parts[parts.length - 1];
  
  if (!acc[folder]) acc[folder] = [];
  acc[folder].push({ path, name });
  return acc;
}, {} as Record<string, { path: string; name: string }[]>);

export default function Layout() {
  const location = useLocation();
  const isNotes = location.pathname.startsWith('/notes/') && location.pathname !== '/notes';
  const isPosts = location.pathname.startsWith('/posts/') && location.pathname !== '/posts';
  const isDocSidebar = isNotes || isPosts;
  const { theme, setTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      setScrollProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    setScrollProgress(0);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 bg-theme-bg dark:bg-[#0d1117] text-theme-text dark:text-[#c9d1d9] font-sans flex flex-col transition-colors overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-theme-card/80 dark:bg-[#161b22]/80 backdrop-blur-md border-b border-theme-border dark:border-[#30363d] flex items-center px-4 md:px-8 shrink-0 relative z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-zinc-600 dark:text-[#c9d1d9] hover:bg-theme-hover dark:hover:bg-[#21262d] rounded-md transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2 font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
            <Github size={20} className="text-zinc-900 dark:text-white" />
            Pranav Shinde
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 ml-12 text-xs font-medium text-zinc-600 dark:text-[#8b949e]">
          <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-zinc-900 dark:text-white font-semibold' : 'hover:text-zinc-900 dark:hover:text-[#c9d1d9]'}`}>Home</Link>
          <Link to="/projects" className={`transition-colors ${location.pathname === '/projects' ? 'text-zinc-900 dark:text-white font-semibold' : 'hover:text-zinc-900 dark:hover:text-[#c9d1d9]'}`}>Projects</Link>
          <Link to="/notes" className={`transition-colors ${location.pathname === '/notes' || isNotes ? 'text-zinc-900 dark:text-white font-semibold flex items-center gap-1.5' : 'hover:text-zinc-900 dark:hover:text-[#c9d1d9] flex items-center gap-1.5'}`}>
            <BookOpen size={14} />
            Notes
          </Link>
          <Link to="/posts" className={`transition-colors ${location.pathname === '/posts' || isPosts ? 'text-zinc-900 dark:text-white font-semibold flex items-center gap-1.5' : 'hover:text-zinc-900 dark:hover:text-[#c9d1d9] flex items-center gap-1.5'}`}>
            <BookOpen size={14} />
            Posts
          </Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-zinc-900 dark:text-white font-semibold flex items-center gap-1.5' : 'hover:text-zinc-900 dark:hover:text-[#c9d1d9] flex items-center gap-1.5'}`}>About</Link>
        </nav>
        
        <div className="ml-auto flex items-center gap-1">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-[#8b949e] dark:hover:text-[#c9d1d9] transition-colors rounded-md"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="https://github.com/panda-yoo" target="_blank" rel="noreferrer" className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-[#8b949e] dark:hover:text-[#c9d1d9] transition-colors rounded-md">
            <Github size={18} />
          </a>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-theme-bg dark:bg-[#0d1117] z-40 flex flex-col overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2 border-b border-theme-border dark:border-[#30363d]">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-md transition-colors ${location.pathname === '/' ? 'bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] font-semibold' : 'text-zinc-600 dark:text-[#8b949e] hover:bg-theme-hover dark:hover:bg-[#21262d] hover:text-zinc-900 dark:hover:text-[#c9d1d9] font-medium'}`}>
              Home
            </Link>
            <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-md transition-colors ${location.pathname === '/projects' ? 'bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] font-semibold' : 'text-zinc-600 dark:text-[#8b949e] hover:bg-theme-hover dark:hover:bg-[#21262d] hover:text-zinc-900 dark:hover:text-[#c9d1d9] font-medium'}`}>
              Projects
            </Link>
            <Link to="/notes" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/notes' || isNotes ? 'bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] font-semibold' : 'text-zinc-600 dark:text-[#8b949e] hover:bg-theme-hover dark:hover:bg-[#21262d] hover:text-zinc-900 dark:hover:text-[#c9d1d9] font-medium'}`}>
              <BookOpen size={18} />
              Notes
            </Link>
            <Link to="/posts" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/posts' || isPosts ? 'bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] font-semibold' : 'text-zinc-600 dark:text-[#8b949e] hover:bg-theme-hover dark:hover:bg-[#21262d] hover:text-zinc-900 dark:hover:text-[#c9d1d9] font-medium'}`}>
              <BookOpen size={18} />
              Posts
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-md transition-colors ${location.pathname === '/about' ? 'bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] font-semibold' : 'text-zinc-600 dark:text-[#8b949e] hover:bg-theme-hover dark:hover:bg-[#21262d] hover:text-zinc-900 dark:hover:text-[#c9d1d9] font-medium'}`}>
              About
            </Link>
          </nav>
          
          {/* Include sidebar navigation if on Docs/Posts pages, useful for mobile */}
          {isDocSidebar && (
            <div className="flex-1 p-4">
               <div className="px-4 py-2 mb-2">
                  <p className="text-[11px] text-theme-text-muted dark:text-[#8b949e] uppercase font-semibold tracking-widest">{isNotes ? 'Notebooks Directory' : 'Posts Directory'}</p>
               </div>
               <nav className="flex flex-col gap-1">
                  {Object.entries(isNotes ? groupedNotes : groupedPosts).map(([folder, files]) => (
                    <div key={folder} className="mb-4">
                      <div className="px-4 py-2 text-[11px] font-bold text-theme-text-muted dark:text-[#8b949e] uppercase tracking-wider">
                        {folder}
                      </div>
                      <div className="flex flex-col gap-1">
                        {files.map(file => {
                          const linkPath = isNotes ? `/notes/${file.path}` : `/posts/${file.path}`;
                          const isActive = decodeURIComponent(location.pathname) === linkPath;
                          return (
                            <Link 
                              key={file.path} 
                              to={linkPath} 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`px-4 py-2.5 text-[14px] rounded-md transition-colors ${
                                isActive 
                                ? 'font-semibold bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff]' 
                                : 'font-medium text-theme-text-secondary dark:text-[#c9d1d9] hover:text-theme-text dark:hover:text-white hover:bg-theme-hover dark:hover:bg-[#21262d]'
                              }`}
                            >
                              {file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
               </nav>
            </div>
          )}
        </div>
      )}

      {/* Main Layout containing Sidebar + Content for Pages */}
      <div className="flex-1 flex overflow-hidden">
        {isDocSidebar && (
          <aside className="hidden lg:flex w-64 bg-theme-sidebar dark:bg-[#161b22] border-r border-theme-border dark:border-[#30363d] flex-col shrink-0 relative z-40">
             <div className="p-6 border-b border-theme-border dark:border-[#30363d] shrink-0">
                <p className="text-[11px] text-theme-text-muted dark:text-[#8b949e] uppercase font-semibold tracking-widest">{isNotes ? 'Notebooks' : 'Posts'}</p>
             </div>
             <nav className="flex-1 py-4 overflow-y-auto">
                {Object.entries(isNotes ? groupedNotes : groupedPosts).map(([folder, files]) => (
                  <div key={folder} className="mb-4">
                    <div className="px-6 py-2 text-[11px] font-bold text-theme-text-muted dark:text-[#8b949e] uppercase tracking-wider">
                      {folder}
                    </div>
                    {files.map(file => {
                      const linkPath = isNotes ? `/notes/${file.path}` : `/posts/${file.path}`;
                      const isActive = decodeURIComponent(location.pathname) === linkPath;
                      return (
                        <Link 
                          key={file.path} 
                          to={linkPath} 
                          className={`flex px-6 py-2.5 text-[13px] transition-colors ${
                            isActive 
                            ? 'font-semibold bg-theme-accent-soft dark:bg-[#1f6feb]/10 text-theme-accent dark:text-[#58a6ff] border-l-[3px] border-theme-accent dark:border-[#58a6ff]' 
                            : 'font-medium text-theme-text-secondary dark:text-[#c9d1d9] hover:text-theme-text dark:hover:text-white border-l-[3px] border-transparent hover:bg-theme-hover dark:hover:bg-[#21262d]'
                          }`}
                        >
                          {file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Link>
                      );
                    })}
                  </div>
                ))}
             </nav>
             <div className="p-6 border-t border-theme-border dark:border-[#30363d] bg-theme-sidebar dark:bg-[#161b22] shrink-0">
                <div className="h-1.5 w-full bg-theme-border dark:bg-[#21262d] rounded-full mb-3 overflow-hidden">
                   <div 
                     className="h-full bg-theme-accent dark:bg-[#58a6ff] rounded-full transition-all duration-150 ease-out"
                     style={{ width: `${scrollProgress}%` }}
                   ></div>
                </div>
                <span className="text-[10px] text-theme-text-muted dark:text-[#8b949e] tracking-wider uppercase font-medium">Page Progress</span>
             </div>
          </aside>
        )}
        <main 
          id={!isDocSidebar ? "main-scroll-container" : undefined}
          onScroll={!isDocSidebar ? handleScroll : undefined}
          className={`flex-1 flex flex-col relative w-full ${isDocSidebar ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
          <Outlet context={{ setScrollProgress }} />
          
          {/* Footer */}
          {!isDocSidebar && (
            <footer className="border-t border-zinc-200 dark:border-[#30363d] py-10 mt-auto bg-transparent">
              <div className="max-w-5xl mx-auto px-8 flex justify-between items-center text-xs text-zinc-500 dark:text-[#8b949e]">
                <p>© 2026 Pranav Shinde</p>
                <div className="flex gap-4">
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-[#8b949e] tracking-widest uppercase">Panda Learning</span>
                </div>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
