import { motion, AnimatePresence } from 'framer-motion';

const ResearchHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-gray-950 border border-gray-800 text-cyan-400 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase mb-8 shadow-inner"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <i className="fas fa-podcast text-cyan-400"></i> Audio Journal & TTS Enabled
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Space_Grotesk'] mb-6 tracking-tighter leading-tight text-white"
      >
        Research Journal
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed"
      >
        Peer-reviewed technical publications, sub-quadratic attention proofs, and post-training reinforcement learning architectures.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto relative mb-12"
      >
        <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-base z-10 pointer-events-none"></i>
        <input 
          id="research-search-input"
          name="researchSearch"
          aria-label="Search publications, authors, or topics"
          type="text" 
          placeholder="Search publications, authors, categories, or keywords..." 
          className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-4 pl-12 pr-14 text-white text-base placeholder-gray-500 focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/80 focus:outline-none transition-all shadow-inner font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AnimatePresence>
          {searchQuery ? (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10 transition-colors bg-gray-900 hover:bg-gray-800 border border-gray-800 w-7 h-7 rounded-full flex items-center justify-center"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times text-xs"></i>
            </motion.button>
          ) : (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-gray-500 bg-gray-900 border border-gray-800 px-2 py-1 rounded">
              <kbd className="text-gray-400">⌘K</kbd>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ResearchHeader;

