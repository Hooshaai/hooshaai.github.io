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
    <div className="w-full overflow-hidden bg-gray-950/40 py-8 border-y border-gray-800/80 mb-24 relative z-10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      <motion.div 
        animate={{ x: ['0%', '-50%'] }} 
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        className="flex gap-12 sm:gap-16 items-center whitespace-nowrap text-gray-500 font-mono text-sm sm:text-base tracking-wider w-max"
      >
        {marqueeItems.map((tech, i) => (
          <span key={`${tech.name}-${i}`} className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-3 cursor-default group">
            <i className={`${tech.icon} opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all text-base`}></i>
            <span className="text-gray-400 group-hover:text-white font-medium">{tech.name}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedTech;

