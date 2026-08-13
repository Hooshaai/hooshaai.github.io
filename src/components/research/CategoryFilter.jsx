import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, getCategoryCount }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="w-full flex justify-center mb-12"
    >
      <div 
        role="tablist" 
        aria-label="Research Paper Categories" 
        className="flex items-center gap-2 overflow-x-auto max-w-full py-2 px-3 bg-gray-950/60 border border-gray-800/90 rounded-full backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] scrollbar-none"
      >
        {categories.map(cat => {
          const count = getCategoryCount(cat);
          const isActive = activeCategory === cat;
          
          return (
            <motion.button 
              key={cat}
              role="tab"
              aria-selected={isActive}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-colors duration-200 flex items-center gap-2.5 shrink-0 select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                isActive 
                  ? 'text-black font-bold' 
                  : 'text-gray-400 hover:text-white font-medium'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-white rounded-full -z-10 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
              <span 
                className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-black/15 text-black font-bold border border-black/20' 
                    : 'bg-gray-900/90 text-cyan-400 border border-cyan-500/20'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;


