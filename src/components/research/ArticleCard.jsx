import { motion } from 'framer-motion';

const ArticleCard = ({ article, isPlaying, isPaused, progress, viewMode = 'grid', onSelect, onTogglePlay }) => {
  const isList = viewMode === 'list';

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -12 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className={`group relative flex ${isList ? 'flex-col sm:flex-row sm:items-center' : 'flex-col justify-between'} p-5 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-lg ${
        isPlaying 
          ? 'bg-slate-900/95 border border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.2)]' 
          : 'bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/85 hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)]'
      }`}
    >
      {/* Top Ambient Highlight */}
      <div 
        aria-hidden="true" 
        className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
          isPlaying 
            ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(0,240,255,0.9)] opacity-100' 
            : 'bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100'
        }`} 
      />

      <div className={`flex-1 flex flex-col ${isList ? 'pr-0 sm:pr-6 mb-4 sm:mb-0' : 'mb-4'}`}>
        
        {/* Category & Date Header */}
        <div className="flex justify-between items-center mb-3 gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-md bg-cyan-950/50 uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {article.categoryName || article.category || 'Research'}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">{article.pubDate || 'Aug 2026'}</span>
            {isPlaying && (
              <div 
                aria-label="Playing Audio"
                className="flex items-end gap-0.5 h-3.5 px-2 py-0.5 bg-cyan-950/80 rounded-full border border-cyan-400/50 text-cyan-400"
              >
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-1.5"></span>
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-3"></span>
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-2"></span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`font-bold font-['Space_Grotesk'] text-slate-100 group-hover:text-cyan-300 transition-colors duration-200 leading-snug tracking-tight ${
          isList ? 'text-lg sm:text-xl mb-2' : 'text-base sm:text-lg line-clamp-2 mb-2 min-h-[2.75rem]'
        }`}>
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="text-slate-400 group-hover:text-slate-300 text-xs line-clamp-3 leading-relaxed font-light mb-4 flex-grow transition-colors">
          {article.snippet}
        </p>
        
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono mt-auto">
          <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <i className="fas fa-clock text-cyan-400 text-[10px]" aria-hidden="true"></i>
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <i className="fas fa-file-alt text-cyan-400/80 text-[10px]" aria-hidden="true"></i>
            <span>{article.wordCount}</span>
          </span>
          {article.author && (
            <span className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 truncate max-w-[150px]">
              <i className="fas fa-user-edit text-slate-400 text-[10px]" aria-hidden="true"></i>
              <span className="truncate">{article.author}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center gap-2 shrink-0 ${isList ? 'w-full sm:w-auto mt-3 sm:mt-0' : 'mt-auto pt-3 border-t border-slate-800/80'}`}>
        <button 
          className="flex-1 sm:flex-none bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          onClick={() => onSelect(article)}
        >
          <i className="fas fa-book-open text-[11px]" aria-hidden="true"></i>
          <span>Read Paper</span>
        </button>

        <button 
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all duration-200 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            isPlaying && !isPaused
              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.6)]' 
              : isPlaying && isPaused
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/40'
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
        <div className="w-full h-1 bg-slate-950 rounded-full mt-3 overflow-hidden border border-slate-800">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress || 0}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
          />
        </div>
      )}
    </motion.article>
  );
};

export default ArticleCard;
