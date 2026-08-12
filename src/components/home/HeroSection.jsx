import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="hero min-h-screen flex flex-col justify-center items-center text-center pt-32 pb-16 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full font-mono text-xs md:text-sm text-gray-300 mb-10 transition-all cursor-default"
      >
        <span className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></span>
        <span className="tracking-widest uppercase font-medium">New Release: Continuous Flow Matching</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold font-['Space_Grotesk'] mb-8 tracking-tighter leading-[1.05] text-white"
      >
        Beyond Bigger Datasets
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed tracking-wide font-light"
      >
        Building the next generation of AI reasoning engines with post-training reinforcement learning, linear attention, and verified logic.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/research" className="bg-white text-black px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
          Read Research <i className="fas fa-arrow-right text-sm"></i>
        </Link>
        <Link to="/models" className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
          Explore Models
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
