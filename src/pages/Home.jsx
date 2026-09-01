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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="home-page overflow-hidden bg-slate-950 text-slate-200 min-h-screen">
      <SEO 
        title="Home"
        description="Pioneering sub-quadratic attention mechanisms, grounded causal verification, continuous flow matching, and post-training reinforcement learning architectures."
      />
      
      <NeuralCanvas />
      <HeroSection />
      <MetricsGrid />
      <FeaturedTech />

      {/* Section 1: Featured Research Series */}
      <section aria-labelledby="featured-research-heading" className="px-4 md:px-6 mb-28 relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold">
                01 // Research Tracks
              </span>
            </div>
            <h2 id="featured-research-heading" className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              Featured Research Series
            </h2>
          </div>
          <Link 
            to="/research" 
            className="group hidden sm:flex text-slate-400 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors duration-200"
          >
            <span>All Research Tracks</span>
            <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            { name: 'Linear Attention', icon: 'fa-stream', count: '5 Papers', desc: 'Sub-quadratic sequence modeling & state space memory scaling.' },
            { name: 'Verification', icon: 'fa-shield-alt', count: '4 Papers', desc: 'Lean 4 interactive theorem provers & code execution substrates.' },
            { name: 'Cognition', icon: 'fa-brain', count: '6 Papers', desc: 'Post-training RLVR, self-distillation & reasoning search trees.' },
            { name: 'Consciousness', icon: 'fa-eye', count: '5 Papers', desc: 'Continuous flow matching ODEs & state space boundaries.' }
          ].map((series) => (
            <motion.article 
              variants={itemVariants}
              key={series.name} 
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/85 hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)] transition-all duration-300 group flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400 group-hover:text-black text-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                  <i className={`fas ${series.icon} text-sm`}></i>
                </div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2 tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {series.name}
                </h3>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed font-sans font-light">
                  {series.desc}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 mt-auto">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
                  {series.count}
                </span>
                <Link 
                  to="/research" 
                  aria-label={`Explore ${series.name} research articles`}
                  className="text-cyan-400 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore</span>
                  <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Section 2: Recent Dispatches */}
      <section aria-labelledby="latest-dispatches-heading" className="px-4 md:px-6 mb-28 relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold">
                02 // Publications
              </span>
            </div>
            <h2 id="latest-dispatches-heading" className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              Recent Dispatches
            </h2>
          </div>
          <Link 
            to="/research" 
            aria-label="View all research dispatches"
            className="group hidden md:flex text-slate-400 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors duration-200"
          >
            <span>View All Dispatches</span>
            <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {latestArticles.map((article, i) => (
            <motion.article 
              variants={itemVariants}
              key={article.id || i} 
              className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900/85 hover:border-cyan-500/40 hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)] transition-all duration-300 group backdrop-blur-xl h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase border border-cyan-500/30 px-2.5 py-0.5 rounded-md bg-cyan-500/10 font-semibold">
                    {article.categoryName || article.category || 'Research'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <i className="far fa-clock text-[10px] text-cyan-400"></i> {article.readTime || '8 min'}
                  </span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] mb-2 leading-snug tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-2 min-h-[2.75rem]">
                  {article.title}
                </h3>
                
                <p className="text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed font-sans font-light">
                  {article.snippet}
                </p>
              </div>
              
              <div className="pt-3 border-t border-slate-800/80 mt-auto flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">Peer-Reviewed</span>
                <Link 
                  to="/research" 
                  aria-label={`Read dispatch: ${article.title}`}
                  className="text-cyan-400 font-semibold transition-colors inline-flex items-center gap-1.5 hover:text-white"
                >
                  <span>Read Paper</span>
                  <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Section 3: Interactive Lab Banner CTA */}
      <section className="px-4 md:px-6 mb-24 relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative p-7 sm:p-10 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="space-y-2 max-w-2xl text-left">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold inline-block">
              Interactive Execution Substrate
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Test Continuous Flow ODEs Live in Browser
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              Simulate 2D trajectory velocity vector fields, configure GRPO policy parameters, and benchmark .safetensors model weights directly in our web execution sandbox.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/labs"
              className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl font-mono tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <i className="fas fa-play text-xs"></i>
              <span>Launch Labs</span>
            </Link>
            <Link
              to="/models"
              className="px-5 py-3 bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-200 font-bold text-xs rounded-xl font-mono tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-database text-xs text-cyan-400"></i>
              <span>Models Vault</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
