import { motion, AnimatePresence } from 'framer-motion';

const ResearchHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-white/5 text-gray-300 border border-white/10 px-5 py-2 rounded-full text-xs md:text-sm font-mono tracking-widest uppercase mb-10 cursor-default"
      >
        <i className="fas fa-podcast text-gray-400"></i> Audio Journal Available
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] mb-12 tracking-tighter leading-tight text-white"
      >
        Research Journal
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto relative mb-16"
      >
        <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg z-10 peer-focus:text-white transition-colors"></i>
        <input 
          id="research-search-input"
          name="researchSearch"
          aria-label="Search publications, authors, or topics"
          type="text" 
          placeholder="Search publications, authors, or topics..." 
          className="peer w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-14 text-white text-lg placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all relative z-0 tracking-wide font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white z-10 transition-colors bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times text-sm"></i>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ResearchHeader;
