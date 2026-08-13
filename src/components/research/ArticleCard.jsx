import { motion } from 'framer-motion';

const ArticleCard = ({ article, isPlaying, isPaused, progress, viewMode = 'grid', onSelect, onTogglePlay }) => {
  const isList = viewMode === 'list';

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -15 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className={`flex ${isList ? 'flex-col sm:flex-row sm:items-center' : 'flex-col justify-between'} p-7 md:p-8 rounded-3xl ${
        isPlaying 
          ? 'bg-gray-950/80 border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.22)]' 
          : 'bg-gray-950/70 border-gray-800/90 hover:border-cyan-500/50 hover:bg-gray-900/50'
      } border transition-all duration-300 group relative overflow-hidden backdrop-blur-xl shadow-2xl`}
    >
      {/* Top Ambient Highlight Gradient */}
      <div 
        aria-hidden="true" 
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          isPlaying 
            ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.9)]' 
            : 'bg-gradient-to-r from-transparent via-gray-800 to-transparent group-hover:via-cyan-400/80'
        } transition-all duration-500`} 
      />

      <div className={`flex-1 ${isList ? 'pr-0 sm:pr-8 mb-6 sm:mb-0' : 'mb-6'}`}>
        {/* Category & Date Header */}
        <div className="flex justify-between items-center mb-5 gap-2">
          <span className="text-[10px] font-mono tracking-widest text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/50 uppercase shadow-inner">
            {article.categoryName || article.category || 'Research'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-400">{article.pubDate || 'Aug 2026'}</span>
            {isPlaying && (
              <div 
                aria-label="Playing Audio"
                className="flex items-end gap-1 h-4 px-2 py-0.5 bg-cyan-950/80 rounded-full border border-cyan-400/50 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
              >
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-4"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3"></span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] mb-3 text-white group-hover:text-cyan-300 transition-colors duration-200 leading-snug tracking-tight">
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed tracking-wide font-light">
          {article.snippet}
        </p>
        
        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono tracking-wider">
          <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-gray-800/80">
            <i className="fas fa-clock text-cyan-400/90" aria-hidden="true"></i>
            {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-gray-800/80">
            <i className="fas fa-file-alt text-cyan-400/70" aria-hidden="true"></i>
            {article.wordCount}
          </span>
          {article.author && (
            <span className="hidden sm:flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-gray-800/80 text-gray-300">
              <i className="fas fa-user-edit text-gray-400" aria-hidden="true"></i>
              {article.author}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 shrink-0 ${isList ? 'w-full sm:w-auto mt-4 sm:mt-0' : 'mt-auto pt-4'}`}>
        <button 
          className="flex-1 sm:flex-none bg-white text-black px-6 py-3.5 rounded-2xl font-bold tracking-wide hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase shadow-md hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          onClick={() => onSelect(article)}
        >
          <i className="fas fa-book-open text-xs" aria-hidden="true"></i> Read Paper
        </button>
        <button 
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            isPlaying && !isPaused
              ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.6)]' 
              : isPlaying && isPaused
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-gray-900/90 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800/90 hover:border-cyan-500/40'
          }`}
          title={isPlaying && !isPaused ? 'Pause Audio' : 'Listen Article'}
          aria-label={isPlaying && !isPaused ? 'Pause Audio' : 'Listen Article'}
          onClick={() => onTogglePlay(article)}
        >
          <i className={`fas ${isPlaying && !isPaused ? 'fa-pause' : 'fa-play ml-0.5'}`} aria-hidden="true"></i>
        </button>
      </div>

      {/* Audio Progress Bar */}
      {isPlaying && (
        <div className="w-full h-1.5 bg-gray-900 rounded-full mt-5 overflow-hidden relative border border-gray-800">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress || 0}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.9)]"
          />
        </div>
      )}
    </motion.article>
  );
};

export default ArticleCard;


