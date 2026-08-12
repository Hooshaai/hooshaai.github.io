import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import NeuralCanvas from '../components/home/NeuralCanvas';
import HeroSection from '../components/home/HeroSection';
import MetricsGrid from '../components/home/MetricsGrid';
import FeaturedTech from '../components/home/FeaturedTech';

const Home = () => {
  const [articles, setArticles] = useState(ALL_ARTICLES);

  useEffect(() => {
    fetchRealArticles().then(data => {
      if (data && data.length > 0) setArticles(data);
    });
  }, []);

  const latestArticles = articles ? articles.slice(0, 3) : [];

  return (
    <div className="home-page overflow-hidden bg-black text-gray-200">
      <NeuralCanvas />
      <HeroSection />
      <MetricsGrid />
      <FeaturedTech />

      <section className="px-4 mb-32 relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] mb-12 tracking-tight text-white">Featured Research</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Linear Attention', icon: 'fa-stream' },
            { name: 'Verification', icon: 'fa-shield-alt' },
            { name: 'Cognition', icon: 'fa-brain' },
            { name: 'Consciousness', icon: 'fa-eye' }
          ].map((series, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={series.name} 
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/20 hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 group flex flex-col h-full shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <i className={`fas ${series.icon} text-lg text-white opacity-90`}></i>
              </div>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-3 tracking-tight text-white">{series.name}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed font-light flex-1">Explore our fundamental breakthroughs in {series.name.toLowerCase()} architecture and implementation details.</p>
              <div className="flex justify-between items-center pt-6 border-t border-white/20 mt-auto">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">4 Articles</span>
                <Link to="/research" className="text-white hover:text-gray-300 text-sm font-medium tracking-wide flex items-center gap-2 transition-colors">
                  Explore <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 mb-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white">Latest Dispatches</h2>
          <Link to="/research" className="hidden md:flex text-gray-400 hover:text-white text-sm font-mono tracking-widest uppercase items-center gap-2 transition-colors">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={article.id || i} 
              className="flex flex-col p-8 rounded-3xl border border-white/20 bg-white/[0.03] hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 group shadow-lg"
            >
              <div className="text-[10px] font-mono tracking-widest text-gray-400 mb-4 uppercase border border-white/10 px-3 py-1 rounded-full bg-white/5 inline-block self-start">
                {article.categoryName || article.category || 'Research'}
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-3 leading-snug tracking-tight text-white group-hover:text-gray-300 transition-colors">{article.title}</h3>
              <p className="text-gray-400 text-sm mb-8 flex-1 line-clamp-3 leading-relaxed font-light">{article.snippet}</p>
              <div className="pt-6 border-t border-white/20 mt-auto">
                <Link to="/research" className="text-white font-medium tracking-wide transition-colors inline-flex items-center gap-2 text-sm">
                  Read <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
