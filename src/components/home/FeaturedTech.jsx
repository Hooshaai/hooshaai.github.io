import { motion } from 'framer-motion';

const techItems = [
  { name: 'PyTorch', icon: 'fas fa-fire' },
  { name: 'CUDA', icon: 'fas fa-microchip' },
  { name: 'Triton', icon: 'fas fa-water' },
  { name: 'HuggingFace', icon: 'fas fa-cube' },
  { name: 'React', icon: 'fab fa-react' },
  { name: 'Vite', icon: 'fas fa-bolt' },
  { name: 'Recharts', icon: 'fas fa-chart-line' },
  { name: 'Framer Motion', icon: 'fas fa-layer-group' },
  { name: 'Python', icon: 'fab fa-python' },
  { name: 'KaTeX', icon: 'fas fa-square-root-variable' }
];

const FeaturedTech = () => {
  const marqueeItems = [...techItems, ...techItems, ...techItems, ...techItems];

  return (
    <div className="w-full overflow-hidden bg-slate-900/40 backdrop-blur-xl py-6 border-y border-slate-800/80 mb-28 relative z-10">
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        animate={{ x: ['0%', '-50%'] }} 
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-10 items-center whitespace-nowrap text-slate-400 font-mono text-xs sm:text-sm tracking-wider w-max"
      >
        {marqueeItems.map((tech, i) => (
          <div 
            key={`${tech.name}-${i}`} 
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-default group"
          >
            <i className={`${tech.icon} text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all text-xs`}></i>
            <span className="text-slate-300 group-hover:text-white font-medium">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedTech;

