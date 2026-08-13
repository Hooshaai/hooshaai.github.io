import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <SEO title="404 - Page Not Found" description="The requested research route does not exist." />
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-slate-900/70 border border-slate-800 backdrop-blur-2xl p-8 md:p-12 rounded-3xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>

        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-bold">
          404 // ROUTE NOT FOUND
        </span>

        <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white mb-4 tracking-tight">
          Trajectory Lost
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed font-light">
          The research page or substrate endpoint you are trying to reach does not exist or has been relocated within our neural graph.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl font-mono tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] w-full"
        >
          <i className="fas fa-home text-xs"></i> Return To Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
