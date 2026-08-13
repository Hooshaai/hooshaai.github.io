import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSpotlight from '../../hooks/useSpotlight';
import { ALL_ARTICLES, fetchRealArticles } from '../../data/articles';
import ArticleModal from './ArticleModal';

const SpotlightSearch = () => {
  const { isOpen, query, setQuery, close } = useSpotlight();
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const quickNavItems = useMemo(() => [
    { title: 'Browse Research Journal', sub: '20 Papers', icon: 'fa-newspaper', iconColor: 'text-cyan-400', path: '/research' },
    { title: 'Explore Safetensors Model Vault', sub: '6 Models', icon: 'fa-cube', iconColor: 'text-purple-400', path: '/models' },
    { title: 'Continuous Flow ODE Solvers & Labs', sub: 'Interactive', icon: 'fa-flask', iconColor: 'text-amber-400', path: '/labs' },
    { title: 'Tech Ecosystem & Infrastructure', sub: 'HPC & Kernels', icon: 'fa-network-wired', iconColor: 'text-emerald-400', path: '/ecosystem' },
  ], []);

  const totalItemsCount = query.trim() ? searchResults.length : quickNavItems.length;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectArticle = useCallback((art) => {
    setSelectedArticle(art);
    close();
  }, [close]);

  const handleQuickNav = useCallback((path) => {
    navigate(path);
    close();
  }, [navigate, close]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalItemsCount > 0 ? (prev + 1) % totalItemsCount : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalItemsCount > 0 ? (prev - 1 + totalItemsCount) % totalItemsCount : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        if (searchResults[selectedIndex]) {
          handleSelectArticle(searchResults[selectedIndex]);
        }
      } else {
        if (quickNavItems[selectedIndex]) {
          handleQuickNav(quickNavItems[selectedIndex].path);
        }
      }
    }
  }, [isOpen, query, searchResults, quickNavItems, selectedIndex, totalItemsCount, handleSelectArticle, handleQuickNav]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gray-950/95 border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-[0_25px_80px_rgba(0,240,255,0.18)] overflow-hidden font-mono text-left backdrop-blur-2xl relative"
            >
              {/* Header Input */}
              <div className="flex items-center px-4 py-1 border-b border-gray-800/90 relative">
                <i className="fas fa-search text-cyan-400 text-base ml-2 pointer-events-none" aria-hidden="true"></i>
                <input 
                  id="spotlight-search-input"
                  name="spotlightSearch"
                  aria-label="Search publications, models, labs, ecosystem"
                  autoFocus
                  type="text" 
                  placeholder="Search publications, authors, models, or topics..." 
                  className="w-full bg-transparent border-none p-4 text-white focus:outline-none text-sm placeholder-gray-500 font-light tracking-wide"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')} 
                    className="text-gray-400 hover:text-white mr-2 text-xs w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 transition-colors"
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                )}
                <button 
                  className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 px-2 py-1 rounded text-gray-400 hover:text-white font-bold transition-colors" 
                  onClick={close}
                  aria-label="Close spotlight search"
                >
                  ESC
                </button>
              </div>
              
              {/* Results Body */}
              <div className="p-3 max-h-96 overflow-y-auto scrollbar-none">
                {query.length > 0 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-widest flex justify-between items-center">
                        <span>Publication Results ({searchResults.length})</span>
                        <span className="text-cyan-400 font-mono text-[9px]">Press ↵ to select</span>
                      </div>
                      {searchResults.map((art, index) => {
                        const isFocused = index === selectedIndex;
                        return (
                          <div 
                            key={art.id}
                            onClick={() => handleSelectArticle(art)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-150 group flex items-start gap-3 border ${
                              isFocused 
                                ? 'bg-cyan-950/60 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]' 
                                : 'bg-transparent border-transparent hover:bg-gray-900/80 hover:border-gray-800'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                              isFocused ? 'bg-cyan-400 text-black border-cyan-300 font-bold' : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
                            }`}>
                              <i className="fas fa-file-alt" aria-hidden="true"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-bold truncate font-['Space_Grotesk'] ${isFocused ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'}`}>
                                {art.title}
                              </div>
                              <div className="text-xs text-gray-400 line-clamp-1 font-light mt-0.5">
                                {art.snippet}
                              </div>
                              <div className="text-[10px] text-cyan-400/90 mt-1 flex items-center gap-2 font-mono">
                                <span>{art.categoryName || art.category}</span>
                                <span>•</span>
                                <span>{art.readTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-gray-400 text-sm">
                      <i className="fas fa-search text-2xl mb-3 text-cyan-400/40 block" aria-hidden="true"></i>
                      No publications found matching "<strong className="text-white">{query}</strong>".
                    </div>
                  )
                ) : (
                  <div className="px-2 py-2">
                    <div className="text-[10px] font-bold text-gray-400 px-2 mb-2 uppercase tracking-widest flex justify-between items-center">
                      <span>Quick Navigation</span>
                      <span className="text-gray-500 text-[9px]">Use ↑↓ to navigate</span>
                    </div>
                    {quickNavItems.map((item, index) => {
                      const isFocused = index === selectedIndex;
                      return (
                        <div 
                          key={item.path}
                          onClick={() => handleQuickNav(item.path)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`p-3 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all duration-150 border ${
                            isFocused 
                              ? 'bg-cyan-950/60 border-cyan-500/40 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]' 
                              : 'bg-transparent border-transparent hover:bg-gray-900/80 hover:border-gray-800 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <i className={`fas ${item.icon} ${item.iconColor}`} aria-hidden="true"></i> 
                            <span className="font-bold font-['Space_Grotesk'] text-sm">{item.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono bg-black/40 border border-gray-800 px-2 py-0.5 rounded-md">{item.sub}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Shortcut Hints */}
              <div className="px-4 py-2.5 bg-gray-950 border-t border-gray-800/90 text-[10px] text-gray-400 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-cyan-400">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-cyan-400">↵</kbd> select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-cyan-400">ESC</kbd> close
                  </span>
                </div>
                <span className="text-cyan-400/70 text-[9px] font-mono">Hoosha AI Command Hub</span>
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


