import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import ArticleModal from '../components/ui/ArticleModal';
import useTTSPlayer from '../hooks/useTTSPlayer';
import ResearchHeader from '../components/research/ResearchHeader';
import CategoryFilter from '../components/research/CategoryFilter';
import ArticleCard from '../components/research/ArticleCard';
import SEO from '../components/common/SEO';

const Research = () => {
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'title'
  const [isSortOpen, setIsSortOpen] = useState(false);

  const tts = useTTSPlayer();

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const normalizeCat = (cat) => (cat || '').toLowerCase().replace(/\s+/g, '-');

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    let result = articles.filter(art => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        art.title?.toLowerCase().includes(q) || 
        (art.snippet && art.snippet.toLowerCase().includes(q)) ||
        (art.category && art.category.toLowerCase().includes(q)) ||
        (art.author && art.author.toLowerCase().includes(q));
      
      if (!matchesSearch) return false;
      if (activeCategory === 'All') return true;

      const target = normalizeCat(activeCategory);
      const artCat = normalizeCat(art.category);
      const artCatName = normalizeCat(art.categoryName);

      return artCat.includes(target) || artCatName.includes(target) || target.includes(artCat);
    });

    if (sortBy === 'oldest') {
      result = [...result].reverse();
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [articles, searchQuery, activeCategory, sortBy]);

  const getCategoryCount = (catName) => {
    if (!articles) return 0;
    if (catName === 'All') return articles.length;
    const target = normalizeCat(catName);
    return articles.filter(a => {
      const c1 = normalizeCat(a.category);
      const c2 = normalizeCat(a.categoryName);
      return c1.includes(target) || c2.includes(target) || target.includes(c1);
    }).length;
  };

  const categories = ['All', 'Linear Attention', 'Verification', 'Cognition', 'Consciousness'];

  return (
    <div className="research-page pt-32 pb-24 px-4 max-w-7xl mx-auto min-h-screen relative z-10">
      <SEO 
        title="Research Journal"
        description="Peer-reviewed technical publications, sub-quadratic attention proofs, audio journal podcasts, and post-training reinforcement learning architectures."
        keywords="Research Papers, Substack Journal, Linear Attention, GRPO, Continuous Flow Matching, AI Dispatches"
      />

      <section aria-label="Research Journal Controls" className="text-center mb-12">
        <ResearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          getCategoryCount={getCategoryCount} 
        />
      </section>

      {/* Results Status & Toolbar Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 text-gray-400 text-xs font-mono tracking-widest uppercase border-b border-gray-800/80 pb-4 px-2 backdrop-blur-md">
        <div role="status" aria-live="polite" className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Showing <strong className="text-white font-bold">{filteredArticles.length}</strong> results
          </span>
          {(searchQuery || activeCategory !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-cyan-400 hover:text-cyan-300 underline lowercase font-sans text-xs cursor-pointer ml-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-md px-2 py-1 bg-gray-950/60 border border-gray-800/80"
              aria-expanded={isSortOpen}
              aria-label="Sort options"
            >
              <span className="text-gray-500">Sort:</span>
              <span className="text-cyan-300 font-bold capitalize">{sortBy}</span>
              <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-cyan-400' : ''}`} aria-hidden="true"></i>
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-36 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl z-30 overflow-hidden py-1 backdrop-blur-xl"
                >
                  {[
                    { id: 'newest', label: 'Newest First' },
                    { id: 'oldest', label: 'Oldest First' },
                    { id: 'title', label: 'Title (A-Z)' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors flex items-center justify-between ${
                        sortBy === option.id 
                          ? 'bg-cyan-950/60 text-cyan-300 font-bold border-l-2 border-cyan-400' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && <i className="fas fa-check text-[10px] text-cyan-400"></i>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Switcher (Grid vs List) */}
          <div className="flex items-center gap-1 bg-gray-950/80 p-1 rounded-xl border border-gray-800/80 shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'grid' 
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <i className="fas fa-th-large text-xs" aria-hidden="true"></i>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'list' 
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <i className="fas fa-list text-xs" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Publications Grid / List */}
      <section aria-label="Research Papers List">
        {filteredArticles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-950/60 border border-gray-800/90 rounded-3xl p-12 text-center text-gray-300 mb-20 backdrop-blur-xl shadow-2xl max-w-lg mx-auto" 
            role="status"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto mb-5 text-cyan-400 text-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <i className="fas fa-search" aria-hidden="true"></i>
            </div>
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-2">No publications found</h3>
            <p className="text-xs text-gray-400 mb-6 font-light leading-relaxed">
              No paper matches "{searchQuery}". Try searching for terms like "attention", "reasoning", or "continuous flow".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Reset Search & Category Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
                : "flex flex-col gap-4 mb-20"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => {
                const isPlaying = tts.currentArticle?.id === article.id && tts.isPlaying;
                const isPaused = tts.currentArticle?.id === article.id && tts.isPaused;
                const progress = isPlaying ? tts.progress : 0;

                return (
                  <ArticleCard 
                    key={article.id}
                    article={article}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    progress={progress}
                    viewMode={viewMode}
                    onSelect={setSelectedArticle}
                    onTogglePlay={(art) => {
                      if (isPlaying) {
                        tts.pause();
                      } else if (isPaused) {
                        tts.resume();
                      } else {
                        tts.play(art);
                      }
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Research;

