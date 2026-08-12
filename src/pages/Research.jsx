import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import ArticleModal from '../components/ui/ArticleModal';
import useTTSPlayer from '../hooks/useTTSPlayer';
import ResearchHeader from '../components/research/ResearchHeader';
import CategoryFilter from '../components/research/CategoryFilter';
import ArticleCard from '../components/research/ArticleCard';

const Research = () => {
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'readTime' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const tts = useTTSPlayer();

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const normalizeCat = (cat) => (cat || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const categories = ['All', 'Linear Attention', 'Verification', 'Cognition', 'Consciousness'];

  const matchesCategory = (art, catName) => {
    if (!catName || catName === 'All') return true;
    const target = normalizeCat(catName);
    const c1 = normalizeCat(art.category);
    const c2 = normalizeCat(art.categoryName);
    return c1.includes(target) || c2.includes(target) || target.includes(c1);
  };

  const getCategoryCount = (catName) => {
    if (!articles) return 0;
    if (catName === 'All') return articles.length;
    return articles.filter(a => matchesCategory(a, catName)).length;
  };

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    let result = articles.filter(art => {
      // Category filter
      if (!matchesCategory(art, activeCategory)) return false;

      // Search query scope (title, snippet, author, category, categoryName, readTime)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = art.title?.toLowerCase().includes(q);
        const inSnippet = art.snippet?.toLowerCase().includes(q);
        const inAuthor = art.author?.toLowerCase().includes(q);
        const inCategory = art.category?.toLowerCase().includes(q);
        const inCategoryName = art.categoryName?.toLowerCase().includes(q);
        const inReadTime = art.readTime?.toLowerCase().includes(q);
        if (!inTitle && !inSnippet && !inAuthor && !inCategory && !inCategoryName && !inReadTime) {
          return false;
        }
      }
      return true;
    });

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'readTime') {
        const tA = parseInt(a.readTime) || 0;
        const tB = parseInt(b.readTime) || 0;
        return tB - tA;
      }
      // Default newest: retain natural index / id
      return 0;
    });
  }, [articles, activeCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  return (
    <div className="research-page pt-32 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen relative z-10 text-left">
      <div className="text-center mb-16">
        <ResearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          getCategoryCount={getCategoryCount} 
        />
      </div>

      {/* Control Bar: Result count, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 text-gray-400 text-xs font-mono tracking-wider border-b border-gray-800/80 pb-4 px-2">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">{filteredArticles.length}</span>
          <span>publication{filteredArticles.length === 1 ? '' : 's'} found</span>
          {(activeCategory !== 'All' || searchQuery) && (
            <button 
              onClick={resetFilters}
              className="text-cyan-400 hover:underline flex items-center gap-1 ml-2 text-[11px]"
            >
              <i className="fas fa-undo text-[10px]"></i> Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Sort by:</span>
            <select
              id="research-sort-select"
              name="researchSort"
              aria-label="Sort publications"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="readTime">Read Time</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <i className="fas fa-th-large text-xs"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                viewMode === 'list' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <i className="fas fa-list text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Publications List / Grid */}
      {filteredArticles.length > 0 ? (
        <motion.div 
          layout 
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20' : 'flex flex-col gap-4 mb-20'}
        >
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article) => {
              const isPlaying = tts.currentArticle?.id === article.id && tts.isPlaying;
              return (
                <ArticleCard 
                  key={article.id}
                  article={article}
                  isPlaying={isPlaying}
                  isPaused={tts.isPaused}
                  progress={isPlaying ? tts.progress : 0}
                  viewMode={viewMode}
                  onSelect={setSelectedArticle}
                  onTogglePlay={(art) => tts.togglePlay(art)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 px-6 bg-gray-950/60 border border-gray-800 rounded-3xl max-w-xl mx-auto mb-20"
        >
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-500 text-2xl mx-auto mb-6">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-2">No publications found</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">
            No papers matched your search criteria "{searchQuery}" in category "{activeCategory}".
          </p>
          <button 
            onClick={resetFilters}
            className="px-6 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors uppercase tracking-wider"
          >
            Clear Filters & Show All
          </button>
        </motion.div>
      )}

      {/* Article Reader Modal */}
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

