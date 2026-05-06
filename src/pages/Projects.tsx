import { useState } from 'react';
import { Github, ExternalLink, Cpu, Activity, Calculator, Clock, Type, Atom, Waves, Database, Grid3X3 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import projectsData from '../data/projects.json';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5" strokeWidth={1.5} />,
  Activity: <Activity className="w-5 h-5" strokeWidth={1.5} />,
  Calculator: <Calculator className="w-5 h-5" strokeWidth={1.5} />,
  Atom: <Atom className="w-5 h-5" strokeWidth={1.5} />,
  Waves: <Waves className="w-5 h-5" strokeWidth={1.5} />,
  Database: <Database className="w-5 h-5" strokeWidth={1.5} />,
  Grid3X3: <Grid3X3 className="w-5 h-5" strokeWidth={1.5} />
};

export default function Projects() {
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetic'>('recent');

  const sortedProjects = [...projectsData].sort((a, b) => {
    if (sortBy === 'alphabetic') {
      return a.title.localeCompare(b.title);
    }
    // recent
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="py-16 md:py-24 px-8 md:px-16 max-w-5xl mx-auto flex-1 w-full bg-transparent transition-colors">
      <div className="space-y-12">
        <div className="border-b border-theme-border/50 pb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-theme-text dark:text-white mb-4 tracking-tight">
            Projects
          </h1>
          <p className="text-[17px] text-theme-text-secondary dark:text-[#a1a1aa] font-medium leading-relaxed max-w-2xl">
            A selection of my work in quantum computing, machine learning, and numerical analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-theme-text-muted dark:text-[#71717a] uppercase tracking-widest mr-2">Sort by</span>
          <div className="flex bg-theme-sidebar dark:bg-[#18181b] p-1 rounded-md border border-theme-border/50">
            <button
              onClick={() => setSortBy('recent')}
              className={`flex flex-1 justify-center items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-sm transition-all duration-200 ${sortBy === 'recent' ? 'bg-theme-card dark:bg-[#27272a] text-theme-text dark:text-white shadow-sm' : 'text-theme-text-muted dark:text-[#a1a1aa] hover:text-theme-text dark:hover:text-[#e4e4e7]'}`}
            >
              <Clock size={14} />
              Recent
            </button>
            <button
              onClick={() => setSortBy('alphabetic')}
              className={`flex flex-1 justify-center items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-sm transition-all duration-200 ${sortBy === 'alphabetic' ? 'bg-theme-card dark:bg-[#27272a] text-theme-text dark:text-white shadow-sm' : 'text-theme-text-muted dark:text-[#a1a1aa] hover:text-theme-text dark:hover:text-[#e4e4e7]'}`}
            >
              <Type size={14} />
              Alphabetic
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 pb-12">
          {sortedProjects.map((project, idx) => {
            const displayDate = new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return (
            <div key={idx} className="flex flex-col p-6 border border-theme-border/70 rounded-2xl bg-theme-sidebar/30 hover:bg-theme-sidebar hover:-translate-y-1 hover:shadow-sm dark:hover:shadow-black/20 hover:border-[var(--color-theme-border)] transition-all duration-300 group relative">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${project.bg.replace('50', '500/10').replace('900/20', '500/10')} ${project.color.replace('600', '500').replace('text-', 'border-')}/30 transform group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`${project.color} dark:${project.color.replace('600', '400')}`}>
                    {iconMap[project.icon] || <Cpu className="w-5 h-5" strokeWidth={1.5} />}
                  </div>
                </div>
                <div className="flex gap-2 text-theme-text-muted dark:text-[#71717a]">
                  <a href={project.github} className="p-2 rounded-full hover:bg-theme-card dark:hover:bg-[#27272a] hover:text-theme-text dark:hover:text-[#ededed] transition-colors duration-200">
                    <Github size={18} />
                  </a>
                  <a href={project.link} className="p-2 rounded-full hover:bg-theme-card dark:hover:bg-[#27272a] hover:text-theme-text dark:hover:text-[#ededed] transition-colors duration-200">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              
              <div className="relative z-10 flex flex-col flex-1">
                {project.date && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-theme-text-muted dark:text-[#71717a] mb-3">
                    <Clock size={12} />
                    <span>{displayDate}</span>
                  </div>
                )}
                <h3 className="text-[17px] font-semibold text-theme-text dark:text-gray-100 mb-2 tracking-tight group-hover:text-theme-accent transition-colors leading-snug">
                  {project.title}
                </h3>
                
                <p className="text-theme-text-secondary dark:text-[#a1a1aa] text-[13.5px] leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-[11px] font-medium text-theme-text-secondary dark:text-[#a1a1aa] bg-theme-border/30 dark:bg-white/5 border border-theme-border/50 dark:border-white/5 rounded-md backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
