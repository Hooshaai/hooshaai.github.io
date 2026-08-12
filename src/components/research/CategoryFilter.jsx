import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, getCategoryCount }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-2.5 mb-10"
    >
      {categories.map(cat => {
        const count = getCategoryCount(cat);
        const isActive = activeCategory === cat;
        return (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2.5 border ${
              isActive 
                ? 'text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold' 
                : 'text-gray-400 hover:text-white bg-gray-950/80 border-gray-800 hover:border-gray-700'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-white rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
            <span 
              className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest ${
                isActive 
                  ? 'bg-black/10 text-black border border-black/20 font-bold' 
                  : 'bg-gray-900 text-cyan-400 border border-gray-800'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;

