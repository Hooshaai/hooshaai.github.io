import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section className="hero min-h-[92vh] flex flex-col justify-center items-center text-center pt-36 pb-24 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto">
      {/* Background Multi-layer Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center max-w-4xl"
      >
        {/* Release Pill Badge */}
        <motion.div variants={itemVariants}>
          <Link
            to="/research"
            className="group relative inline-flex items-center gap-3 bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/70 px-5 py-2.5 rounded-full font-mono text-xs sm:text-sm text-cyan-300 mb-10 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.15)] hover:shadow-[0_0_40px_rgba(0,240,255,0.35)] hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_#00f0ff]"></span>
            </span>
            
            <span className="tracking-widest uppercase font-semibold text-slate-200 group-hover:text-white transition-colors">
              New Release: <span className="text-cyan-400 font-bold">Continuous Flow Matching v2.4</span>
            </span>
            <i className="fas fa-arrow-right text-xs text-cyan-400 group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </motion.div>
        
        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold font-['Space_Grotesk'] mb-8 tracking-tighter leading-[1.04] text-white"
        >
          Beyond Bigger{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
            Datasets
          </span>
        </motion.h1>
        
        {/* Paragraph */}
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed tracking-wide font-light"
        >
          Architecting the next generation of AI reasoning engines with post-training reinforcement learning, linear sub-quadratic attention, and verified Lean 4 causal logic.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <Link 
            to="/research" 
            className="group relative w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl font-bold tracking-wide hover:bg-cyan-300 transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Read Research Papers</span>
            <i className="fas fa-arrow-right text-xs group-hover:translate-x-1.5 transition-transform duration-300"></i>
          </Link>
          
          <Link 
            to="/models" 
            className="group w-full sm:w-auto bg-slate-950/80 backdrop-blur-xl text-slate-200 border border-slate-800 hover:border-cyan-500/50 px-8 py-4 rounded-2xl font-bold tracking-wide hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-sm hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:-translate-y-0.5"
          >
            <i className="fas fa-cube text-xs text-cyan-400 group-hover:rotate-12 transition-transform duration-300"></i>
            <span>Explore Checkpoints</span>
          </Link>

          <Link 
            to="/labs" 
            className="group w-full sm:w-auto bg-cyan-950/30 backdrop-blur-xl text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 px-6 py-4 rounded-2xl font-semibold tracking-wide hover:bg-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5"
          >
            <i className="fas fa-flask text-xs text-cyan-400 group-hover:scale-110 transition-transform"></i>
            <span>Live ODE Lab</span>
          </Link>
        </motion.div>

        {/* Highlight Tech Badges */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-800/80 w-full max-w-2xl text-xs font-mono text-slate-400"
        >
          <span className="text-slate-500 uppercase tracking-widest text-[11px] font-semibold mr-2">Core Pillars:</span>
          {[
            { label: 'Sub-Quadratic Scaling', icon: 'fa-bolt' },
            { label: 'Lean 4 Grounding', icon: 'fa-shield-alt' },
            { label: 'Continuous Flow ODEs', icon: 'fa-water' },
            { label: 'RLVR Post-Training', icon: 'fa-brain' }
          ].map(pillar => (
            <span key={pillar.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors">
              <i className={`fas ${pillar.icon} text-[10px] text-cyan-400`}></i>
              {pillar.label}
            </span>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
};

export default HeroSection;


