import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, getCategoryCount }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      {categories.map(cat => {
        const count = getCategoryCount(cat);
        const isActive = activeCategory === cat;
        return (
          <button 
            key={cat}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-3 tracking-wide border ${isActive ? 'bg-white text-black border-white scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-white/10 hover:border-white/20'}`}
            onClick={() => setActiveCategory(cat)}
          >
            <span>{cat}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono tracking-widest flex items-center justify-center ${isActive ? 'bg-black/10 text-black border border-black/10' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;
