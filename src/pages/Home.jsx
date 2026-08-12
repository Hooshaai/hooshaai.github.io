import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import NeuralCanvas from '../components/home/NeuralCanvas';
import HeroSection from '../components/home/HeroSection';
import MetricsGrid from '../components/home/MetricsGrid';
import FeaturedTech from '../components/home/FeaturedTech';
import ArticleModal from '../components/ui/ArticleModal';

const Home = () => {
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const latestArticles = articles ? articles.slice(0, 3) : [];

  const seriesData = [
    { name: 'Linear Attention', icon: 'fas fa-stream', catKey: 'linear-attention', desc: 'Sub-quadratic context expansion and linear sequence modeling architectures.' },
    { name: 'Verification', icon: 'fas fa-shield-alt', catKey: 'verification', desc: 'Grounded causal evaluation and evolutionary verification to prevent collapse.' },
    { name: 'Cognition', icon: 'fas fa-brain', catKey: 'cognition', desc: 'Post-training reinforcement learning, process supervision, and system-2 search.' },
    { name: 'Consciousness', icon: 'fas fa-eye', catKey: 'consciousness', desc: 'Integrated information theory and global workspace inductive biases for AI.' }
  ];

  const getSeriesCount = (catKey) => {
    if (!articles) return 0;
    return articles.filter(a => {
      const c1 = (a.category || '').toLowerCase();
      const c2 = (a.categoryName || '').toLowerCase();
      return c1.includes(catKey) || c2.includes(catKey) || catKey.includes(c1);
    }).length;
  };

  return (
    <div className="home-page overflow-hidden bg-black text-gray-200 text-left">
      <NeuralCanvas />
      <HeroSection />
      <MetricsGrid />
      <FeaturedTech />

      {/* Featured Research Series */}
      <section className="px-4 sm:px-6 mb-32 relative z-10 max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-full text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Core Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
            Featured Research Series
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesData.map((series, i) => {
            const count = getSeriesCount(series.catKey);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                key={series.name} 
                className="p-8 rounded-3xl bg-gray-950/70 border border-gray-800/90 hover:border-cyan-500/50 hover:bg-gray-900/60 transition-all duration-300 group flex flex-col h-full shadow-xl backdrop-blur-xl relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <i className={`${series.icon} text-lg`}></i>
                </div>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-3 tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {series.name}
                </h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light flex-1">
                  {series.desc}
                </p>
                <div className="flex justify-between items-center pt-6 border-t border-gray-800/80 mt-auto">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    {count} Publications
                  </span>
                  <Link 
                    to="/research" 
                    className="text-white hover:text-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors font-bold"
                  >
                    Explore Series <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1 text-cyan-400"></i>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Latest Dispatches */}
      <section className="px-4 sm:px-6 mb-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span> Fresh Output
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              Latest Dispatches
            </h2>
          </div>
          <Link 
            to="/research" 
            className="hidden md:flex text-cyan-400 hover:text-cyan-300 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors font-bold bg-gray-950 border border-gray-800 px-4 py-2.5 rounded-full"
          >
            View All Publications <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={article.id || i} 
              className="flex flex-col p-8 rounded-3xl border border-gray-800/90 bg-gray-950/70 hover:border-gray-700 hover:bg-gray-900/60 transition-all duration-300 group shadow-xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-[10px] font-mono tracking-widest text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/40 uppercase">
                  {article.categoryName || article.category || 'Research'}
                </div>
                <span className="text-[10px] font-mono text-gray-500">{article.readTime}</span>
              </div>

              <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-3 leading-snug tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-400 text-sm mb-8 flex-1 line-clamp-3 leading-relaxed font-light">
                {article.snippet}
              </p>
              
              <div className="pt-6 border-t border-gray-800/80 mt-auto flex justify-between items-center">
                <button 
                  onClick={() => setSelectedArticle(article)}
                  className="text-white font-bold tracking-wide transition-colors inline-flex items-center gap-2 text-xs uppercase hover:text-cyan-300"
                >
                  <i className="fas fa-book-open text-cyan-400 text-[10px]"></i> Quick Read
                </button>
                <Link to="/research" className="text-gray-500 hover:text-white text-xs font-mono">
                  Full Paper <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Article Modal */}
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

export default Home;

