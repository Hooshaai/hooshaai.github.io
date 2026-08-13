import { motion, AnimatePresence } from 'framer-motion';

const ResearchHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative z-10 max-w-4xl mx-auto">
      {/* Background Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" 
      />

      {/* Top Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2.5 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md hover:border-cyan-400/60 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
        <i className="fas fa-podcast text-cyan-400" aria-hidden="true"></i>
        <span>Audio Journal & TTS Enabled</span>
      </motion.div>
      
      {/* Main Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight leading-tight text-white"
      >
        Research <span className="bg-gradient-to-r from-cyan-400 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">Journal</span>
      </motion.h1>

      {/* Subtitle Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed tracking-wide"
      >
        Peer-reviewed technical publications, <span className="text-cyan-300 font-normal">sub-quadratic attention proofs</span>, and post-training reinforcement learning architectures.
      </motion.p>

      {/* Quick Stats Highlight Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-10 text-xs font-mono text-gray-400"
      >
        <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800/80 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-inner">
          <i className="fas fa-file-contract text-cyan-400" aria-hidden="true"></i>
          <span>Peer-Reviewed</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800/80 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-inner">
          <i className="fas fa-bolt text-cyan-400" aria-hidden="true"></i>
          <span>Sub-quadratic O(N)</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800/80 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-inner">
          <i className="fas fa-headphones text-cyan-400" aria-hidden="true"></i>
          <span>Audio Narration</span>
        </div>
      </motion.div>
      
      {/* Search Bar Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto relative mb-12 group"
      >
        <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 text-base z-10 pointer-events-none transition-colors" aria-hidden="true"></i>
        <input 
          id="research-search-input"
          name="researchSearch"
          aria-label="Search publications, authors, categories or keywords"
          type="text" 
          placeholder="Search publications, authors, categories, or keywords..." 
          className="w-full bg-gray-950/80 border border-gray-800/90 rounded-2xl py-4 pl-12 pr-14 text-white text-base placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AnimatePresence>
          {searchQuery ? (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Clear search query"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10 transition-all bg-gray-900 hover:bg-gray-800 border border-gray-700 w-7 h-7 rounded-full flex items-center justify-center shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times text-xs" aria-hidden="true"></i>
            </motion.button>
          ) : (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-gray-400 bg-gray-900/90 border border-gray-800 px-2.5 py-1 rounded-md shadow-inner pointer-events-none">
              <kbd className="text-cyan-400 font-semibold">⌘K</kbd>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResearchHeader;


