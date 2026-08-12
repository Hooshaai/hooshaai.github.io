import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import ArticleModal from '../components/ui/ArticleModal';
import useTTSPlayer from '../hooks/useTTSPlayer';

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

  const filteredArticles = articles ? articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (art.snippet && art.snippet.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || art.categoryName === activeCategory || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <div className="research-page pt-32 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block bg-purple-900/30 text-purple-400 border border-purple-500/50 px-4 py-1.5 rounded-full text-sm font-mono mb-8 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
          <i className="fas fa-podcast mr-2 animate-pulse"></i> Audio Journal Available
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] mb-8">Research Journal</h1>
        
        <div className="max-w-3xl mx-auto relative mb-12">
          <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full"></div>
          <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl z-10"></i>
          <input 
            type="text" 
            placeholder="Search publications, authors, or topics..." 
            className="w-full bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl py-5 pl-16 pr-12 text-white text-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all relative z-0 shadow-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', 'Linear Attention', 'Verification', 'Cognition', 'Consciousness'].map(cat => (
            <button 
              key={cat}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 text-gray-400 text-sm font-mono border-b border-gray-800 pb-4">
        <span>Showing {filteredArticles.length} results</span>
        <span>Sorted by: Newest</span>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <AnimatePresence>
          {filteredArticles.map((article, i) => {
            const isPlaying = tts.currentArticle?.id === article.id && tts.isPlaying;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={article.id} 
                className={`glass-card card flex flex-col p-8 rounded-3xl border ${isPlaying ? 'border-purple-500 shadow-[0_0_20px_rgba(138,43,226,0.2)]' : 'border-gray-800 hover:border-cyan-500/50 hover:shadow-xl'} transition-all group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-900/20">
                    {article.categoryName}
                  </div>
                  {isPlaying && <div className="text-purple-400 flex items-center gap-1"><span className="w-1 h-3 bg-purple-400 animate-pulse"></span><span className="w-1 h-4 bg-purple-400 animate-pulse" style={{animationDelay: '0.1s'}}></span><span className="w-1 h-2 bg-purple-400 animate-pulse" style={{animationDelay: '0.2s'}}></span></div>}
                </div>
                
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-4 flex-1 group-hover:text-white text-gray-100 transition-colors">{article.title}</h3>
                <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">{article.snippet}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-6 font-mono bg-black/40 p-3 rounded-xl border border-gray-800">
                  <span className="flex items-center"><i className="fas fa-clock mr-2 text-cyan-400"></i>{article.readTime}</span>
                  <span className="flex items-center"><i className="fas fa-file-alt mr-2 text-purple-400"></i>{article.wordCount}</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-lg flex justify-center items-center gap-2"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <i className="fas fa-book-open text-sm"></i> Read
                  </button>
                  <button 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all shadow-lg ${isPlaying ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 hover:text-purple-400 hover:bg-gray-700 border border-gray-700'}`}
                    onClick={() => isPlaying ? tts.pause() : tts.play(article)}
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                </div>
                
                {/* Simulated reading progress indicator at bottom of card */}
                <div className="w-full h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.random() * 80}%` }}></div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

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
