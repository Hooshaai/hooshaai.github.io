import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSpotlight from '../../hooks/useSpotlight';
import { ALL_ARTICLES, fetchRealArticles } from '../../data/articles';
import ArticleModal from './ArticleModal';

const SpotlightSearch = () => {
  const { isOpen, query, setQuery, close } = useSpotlight();
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return articles.filter(art => 
      art.title?.toLowerCase().includes(q) ||
      art.snippet?.toLowerCase().includes(q) ||
      art.categoryName?.toLowerCase().includes(q) ||
      art.category?.toLowerCase().includes(q) ||
      art.author?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [articles, query]);

  const handleSelectArticle = (art) => {
    setSelectedArticle(art);
    close();
  };

  const handleQuickNav = (path) => {
    navigate(path);
    close();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
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
              className="bg-gray-950 border border-gray-800 w-full max-w-2xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-mono text-left"
            >
              <div className="flex items-center px-4 border-b border-gray-800">
                <i className="fas fa-search text-cyan-400 text-base ml-2"></i>
                <input 
                  id="spotlight-search-input"
                  name="spotlightSearch"
                  aria-label="Search publications, models, labs"
                  autoFocus
                  type="text" 
                  placeholder="Search publications, authors, models, or topics..." 
                  className="w-full bg-transparent border-none p-4 text-white focus:outline-none text-sm placeholder-gray-500 font-light"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white mr-2 text-xs">
                    <i className="fas fa-times"></i>
                  </button>
                )}
                <button className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-1 rounded text-gray-400 font-bold" onClick={close}>ESC</button>
              </div>
              
              <div className="p-3 max-h-96 overflow-y-auto">
                {query.length > 0 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-500 px-3 py-1.5 uppercase tracking-widest">
                        Publication Results ({searchResults.length})
                      </div>
                      {searchResults.map(art => (
                        <div 
                          key={art.id}
                          onClick={() => handleSelectArticle(art)}
                          className="p-3 hover:bg-gray-900 rounded-xl cursor-pointer transition-colors group flex items-start gap-3 border border-transparent hover:border-gray-800"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs shrink-0 mt-0.5">
                            <i className="fas fa-file-alt"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white group-hover:text-cyan-300 truncate font-['Space_Grotesk']">
                              {art.title}
                            </div>
                            <div className="text-xs text-gray-400 line-clamp-1 font-light mt-0.5">
                              {art.snippet}
                            </div>
                            <div className="text-[10px] text-cyan-400/80 mt-1 flex items-center gap-2">
                              <span>{art.categoryName || art.category}</span>
                              <span>•</span>
                              <span>{art.readTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      <i className="fas fa-[#00f0ff] fa-search text-2xl mb-2 text-gray-600 block"></i>
                      No publications found matching "{query}".
                    </div>
                  )
                ) : (
                  <div className="px-2 py-2">
                    <div className="text-[10px] font-bold text-gray-500 px-2 mb-2 uppercase tracking-widest">Quick Navigation</div>
                    <div 
                      onClick={() => handleQuickNav('/research')}
                      className="p-3 hover:bg-gray-900 rounded-xl cursor-pointer flex items-center justify-between text-xs text-gray-300 hover:text-white border border-transparent hover:border-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-newspaper text-cyan-400"></i> 
                        <span className="font-bold">Browse Research Journal</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">20 Papers</span>
                    </div>

                    <div 
                      onClick={() => handleQuickNav('/models')}
                      className="p-3 hover:bg-gray-900 rounded-xl cursor-pointer flex items-center justify-between text-xs text-gray-300 hover:text-white border border-transparent hover:border-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-cube text-purple-400"></i> 
                        <span className="font-bold">Explore Safetensors Model Vault</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">6 Models</span>
                    </div>

                    <div 
                      onClick={() => handleQuickNav('/labs')}
                      className="p-3 hover:bg-gray-900 rounded-xl cursor-pointer flex items-center justify-between text-xs text-gray-300 hover:text-white border border-transparent hover:border-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-flask text-amber-400"></i> 
                        <span className="font-bold">Continuous Flow ODE Solvers & Labs</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">Interactive</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SpotlightSearch;

