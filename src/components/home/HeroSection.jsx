import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="hero min-h-[90vh] flex flex-col justify-center items-center text-center pt-32 pb-20 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-3 bg-gray-950/90 backdrop-blur-xl border border-cyan-500/30 px-5 py-2.5 rounded-full font-mono text-xs sm:text-sm text-cyan-300 mb-10 transition-all hover:border-cyan-400/60 shadow-[0_0_25px_rgba(0,240,255,0.15)] cursor-default"
      >
        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
        <span className="tracking-widest uppercase font-medium">New Release: Continuous Flow Matching</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-5xl sm:text-7xl lg:text-8xl font-bold font-['Space_Grotesk'] mb-8 tracking-tighter leading-[1.05] text-white"
      >
        Beyond Bigger <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">Datasets</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base sm:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed tracking-wide font-light"
      >
        Architecting the next generation of AI reasoning engines with post-training reinforcement learning, linear attention, and verified causal logic.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link 
          to="/research" 
          className="group bg-white text-black px-8 py-4 rounded-2xl font-bold tracking-wide hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
        >
          Read Research Paper <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
        </Link>
        <Link 
          to="/models" 
          className="group bg-gray-950/80 backdrop-blur-md text-white border border-gray-800 px-8 py-4 rounded-2xl font-bold tracking-wide hover:bg-gray-900 hover:border-gray-700 transition-all duration-300 flex items-center justify-center gap-3 text-sm"
        >
          Explore Models <i className="fas fa-cube text-xs text-cyan-400 group-hover:rotate-12 transition-transform"></i>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;

