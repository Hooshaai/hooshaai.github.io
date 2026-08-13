import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALL_ARTICLES, fetchRealArticles } from '../data/articles';
import NeuralCanvas from '../components/home/NeuralCanvas';
import HeroSection from '../components/home/HeroSection';
import MetricsGrid from '../components/home/MetricsGrid';
import FeaturedTech from '../components/home/FeaturedTech';
import SEO from '../components/common/SEO';

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
      <SEO 
        title="Home"
        description="Pioneering sub-quadratic attention mechanisms, grounded causal verification, continuous flow matching, and post-training reinforcement learning architectures."
      />
      
      <NeuralCanvas />
      <HeroSection />
      <MetricsGrid />
      <FeaturedTech />

      <section aria-labelledby="featured-research-heading" className="px-4 mb-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-bold">Research Tracks</span>
            <h2 id="featured-research-heading" className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              Featured Research Series
            </h2>
          </div>
          <Link 
            to="/research" 
            className="hidden sm:flex text-slate-400 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors"
          >
            All Tracks <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Linear Attention', icon: 'fa-stream', desc: 'Sub-quadratic sequence modeling & memory scaling.' },
            { name: 'Verification', icon: 'fa-shield-alt', desc: 'Lean 4 theorem provers & execution substrates.' },
            { name: 'Cognition', icon: 'fa-brain', desc: 'Post-training RLVR & self-distillation loops.' },
            { name: 'Consciousness', icon: 'fa-eye', desc: 'Continuous flow matching & state space boundaries.' }
          ].map((series, i) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={series.name} 
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] transition-all duration-300 group flex flex-col h-full backdrop-blur-xl relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-400 group-hover:text-black text-cyan-400 transition-all">
                <i className={`fas ${series.icon} text-base`}></i>
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-2 tracking-tight text-white group-hover:text-cyan-300 transition-colors">{series.name}</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed flex-1 font-sans">
                {series.desc}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80 mt-auto">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">4 Papers</span>
                <Link 
                  to="/research" 
                  aria-label={`Explore ${series.name} research articles`}
                  className="text-cyan-400 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                >
                  Explore <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="latest-dispatches-heading" className="px-4 mb-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-bold">Latest Publications</span>
            <h2 id="latest-dispatches-heading" className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              Recent Dispatches
            </h2>
          </div>
          <Link 
            to="/research" 
            aria-label="View all research dispatches"
            className="hidden md:flex text-slate-400 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors"
          >
            View All Dispatches <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article, i) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={article.id || i} 
              className="flex flex-col p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] transition-all duration-300 group backdrop-blur-xl"
            >
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 mb-3 uppercase border border-cyan-500/30 px-2.5 py-1 rounded-full bg-cyan-500/10 inline-block self-start font-semibold">
                {article.categoryName || article.category || 'Research'}
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-3 leading-snug tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {article.title}
              </h3>
              <p className="text-slate-400 text-xs mb-6 flex-1 line-clamp-3 leading-relaxed font-sans">
                {article.snippet}
              </p>
              <div className="pt-4 border-t border-slate-800/80 mt-auto flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">{article.readTime || '8 min'}</span>
                <Link 
                  to="/research" 
                  aria-label={`Read dispatch: ${article.title}`}
                  className="text-cyan-400 font-mono text-xs font-semibold transition-colors inline-flex items-center gap-1.5 hover:text-white"
                >
                  Read Dispatch <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
