import { useTheme } from '../components/ThemeProvider';

export default function About() {
  return (
    <div className="py-16 md:py-24 px-8 md:px-16 max-w-4xl mx-auto flex-1 w-full bg-transparent transition-colors">
      <div className="space-y-12">
        <div className="border-b border-zinc-200 dark:border-[#30363d] pb-12">
          <h1 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-6 tracking-tight">
            About Me
          </h1>
        </div>
        
        <div className="prose prose-lg dark:prose-invert text-zinc-600 dark:text-[#c9d1d9] leading-relaxed max-w-none">
          <p>
            Computational physics enthusiast with a passion for bridging theory and computation. Skilled in C++ and Python, with hands-on experience building modular, performance-tuned solvers for diffusion, phase transitions, and other numerical experiments. Interested in simulation, numerical methods, and scientific software development.
          </p>
        </div>
      </div>
    </div>
  );
}
