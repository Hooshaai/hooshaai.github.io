import { motion } from 'framer-motion';

const techItems = [
  { name: 'PyTorch', icon: 'fas fa-fire', category: 'Framework' },
  { name: 'CUDA', icon: 'fas fa-microchip', category: 'Hardware' },
  { name: 'Triton', icon: 'fas fa-water', category: 'Kernel' },
  { name: 'Lean 4', icon: 'fas fa-shield-alt', category: 'Prover' },
  { name: 'vLLM', icon: 'fas fa-server', category: 'Inference' },
  { name: 'HuggingFace', icon: 'fas fa-cube', category: 'Hub' },
  { name: 'React 19', icon: 'fab fa-react', category: 'UI' },
  { name: 'Vite 8', icon: 'fas fa-bolt', category: 'Build' },
  { name: 'Recharts', icon: 'fas fa-chart-line', category: 'Data' },
  { name: 'Framer Motion', icon: 'fas fa-layer-group', category: 'Animation' },
  { name: 'Python 3.12', icon: 'fab fa-python', category: 'Core' },
  { name: 'KaTeX', icon: 'fas fa-square-root-variable', category: 'Math' }
];

const FeaturedTech = () => {
  const marqueeItems = [...techItems, ...techItems, ...techItems, ...techItems];

  return (
    <div className="w-full bg-slate-950/60 backdrop-blur-2xl py-8 border-y border-slate-800/80 mb-28 relative z-10 overflow-hidden">
      {/* Header Label */}
      <div className="max-w-6xl mx-auto px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Infrastructure & Core Stack
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          High Performance Compute
        </span>
      </div>

      {/* Fade masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-20 pointer-events-none" />
      
      <div className="flex overflow-hidden group">
        <motion.div 
          animate={{ x: ['0%', '-50%'] }} 
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          className="flex gap-4 items-center whitespace-nowrap text-slate-400 font-mono text-xs tracking-wider w-max group-hover:[animation-play-state:paused]"
        >
          {marqueeItems.map((tech, i) => (
            <div 
              key={`${tech.name}-${i}`} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:-translate-y-0.5"
            >
              <i className={`${tech.icon} text-cyan-400 text-xs transition-transform group-hover/item:scale-110`}></i>
              <span className="text-slate-200 hover:text-white font-medium">{tech.name}</span>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {tech.category}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedTech;


