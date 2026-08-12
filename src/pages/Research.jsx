import { useState, useEffect } from 'react';
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
  const tts = useTTSPlayer();

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const normalizeCat = (cat) => (cat || '').toLowerCase().replace(/\s+/g, '-');

  const filteredArticles = articles ? articles.filter(art => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || art.title.toLowerCase().includes(q) || 
                          (art.snippet && art.snippet.toLowerCase().includes(q));
    
    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;

    const target = normalizeCat(activeCategory);
    const artCat = normalizeCat(art.category);
    const artCatName = normalizeCat(art.categoryName);

    return artCat.includes(target) || artCatName.includes(target) || target.includes(artCat);
  }) : [];

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

      <section aria-labelledby="research-journal-heading" className="text-center mb-20">
        <ResearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          getCategoryCount={getCategoryCount} 
        />
      </section>

      <div className="flex justify-between items-center mb-8 text-gray-400 text-sm font-mono tracking-widest uppercase border-b border-white/10 pb-4 px-2" role="status" aria-live="polite">
        <span>Showing {filteredArticles.length} results</span>
        <span className="flex items-center gap-2">Sort by: <span className="text-gray-200 font-bold">Newest <i className="fas fa-chevron-down text-xs" aria-hidden="true"></i></span></span>
      </div>

      <section aria-label="Research Papers List">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <AnimatePresence>
            {filteredArticles.map((article) => {
              const isPlaying = tts.currentArticle?.id === article.id && tts.isPlaying;
              return (
                <ArticleCard 
                  key={article.id}
                  article={article}
                  isPlaying={isPlaying}
                  onSelect={setSelectedArticle}
                  onTogglePlay={(art) => isPlaying ? tts.pause() : tts.play(art)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

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
