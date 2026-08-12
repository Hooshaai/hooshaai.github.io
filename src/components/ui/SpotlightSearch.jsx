import { motion, AnimatePresence } from 'framer-motion';
import useSpotlight from '../../hooks/useSpotlight';

const SpotlightSearch = () => {
  const { isOpen, query, setQuery, close } = useSpotlight();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md -z-10"
          />
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-black border border-white/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-mono"
          >
            <div className="flex items-center px-4 border-b border-white/20">
              <i className="fas fa-search text-gray-400"></i>
              <input 
                id="spotlight-search-input"
                name="spotlightSearch"
                aria-label="Search publications, models, labs"
                autoFocus
                type="text" 
                placeholder="Search publications, models, labs..." 
                className="w-full bg-transparent border-none p-4 text-white focus:outline-none text-sm"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button className="text-xs bg-white/10 border border-white/20 px-2.5 py-1 rounded text-white font-bold" onClick={close}>ESC</button>
            </div>
            
            <div className="p-2 max-h-96 overflow-y-auto">
              {query.length > 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No results found for "{query}".
                </div>
              ) : (
                <div className="px-2 py-4">
                  <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Quick Actions</div>
                  <div className="p-3 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-gray-200">
                    <i className="fas fa-book text-white"></i> <span>Browse Research Journal</span>
                  </div>
                  <div className="p-3 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-gray-200">
                    <i className="fas fa-cube text-white"></i> <span>Download Models</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpotlightSearch;
