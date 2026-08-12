import { motion } from 'framer-motion';

const techItems = [
  { name: 'PyTorch', icon: 'fa-fire' },
  { name: 'CUDA', icon: 'fa-microchip' },
  { name: 'Triton', icon: 'fa-water' },
  { name: 'HuggingFace', icon: 'fa-cube' },
  { name: 'React', icon: 'fab fa-react' },
  { name: 'Vite', icon: 'fa-bolt' },
  { name: 'Recharts', icon: 'fa-chart-line' },
  { name: 'Framer', icon: 'fa-layer-group' }
];

const FeaturedTech = () => {
  return (
    <div className="w-full overflow-hidden bg-transparent py-10 border-y border-white/10 mb-24 relative z-10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      <motion.div 
        animate={{ x: [0, -1035] }} 
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-16 items-center whitespace-nowrap text-gray-500 font-mono text-xl tracking-wide"
      >
        {Array(4).fill(techItems).flat().map((tech, i) => (
          <span key={i} className="hover:text-white transition-colors duration-300 flex items-center gap-3 cursor-default">
            <i className={`fas ${tech.icon} opacity-60`}></i> {tech.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedTech;
