import { motion } from 'framer-motion';

const ArticleCard = ({ article, isPlaying, isPaused, progress, viewMode = 'grid', onSelect, onTogglePlay }) => {
  const isList = viewMode === 'list';

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.97, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -15 }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      transition={{ duration: 0.3 }}
      className={`group relative flex ${isList ? 'flex-col sm:flex-row sm:items-center' : 'flex-col justify-between'} p-7 md:p-8 rounded-3xl transition-all duration-300 overflow-hidden backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${
        isPlaying 
          ? 'bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 border border-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.25)]' 
          : 'bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-black/90 border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_20px_50px_rgba(0,240,255,0.16)]'
      }`}
    >
      {/* Top Ambient Glow Beam */}
      <div 
        aria-hidden="true" 
        className={`absolute top-0 left-6 right-6 h-[1.5px] transition-all duration-500 ${
          isPlaying 
            ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(0,240,255,1)] opacity-100' 
            : 'bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 group-hover:opacity-100'
        }`} 
      />

      {/* Ambient Corner Glow */}
      <div 
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 group-hover:scale-125 transition-all duration-500" 
      />

      <div className={`relative z-10 flex-1 ${isList ? 'pr-0 sm:pr-8 mb-6 sm:mb-0' : 'mb-6'}`}>
        
        {/* Category & Date Bar */}
        <div className="flex justify-between items-center mb-4 gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/60 uppercase font-semibold shadow-[0_0_12px_rgba(0,240,255,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]"></span>
            {article.categoryName || article.category || 'Research'}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 font-medium">
              {article.pubDate || 'Aug 2026'}
            </span>
            {isPlaying && (
              <div 
                aria-label="Playing Audio"
                className="flex items-end gap-1 h-4 px-2.5 py-0.5 bg-cyan-950/90 rounded-full border border-cyan-400/60 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-4"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3"></span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] mb-3 text-slate-100 group-hover:text-cyan-300 transition-colors duration-200 leading-snug tracking-tight">
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="text-slate-400 group-hover:text-slate-300 text-xs sm:text-sm mb-6 line-clamp-3 leading-relaxed font-light transition-colors">
          {article.snippet}
        </p>
        
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90 text-slate-300 shadow-inner">
            <i className="fas fa-clock text-cyan-400 text-[11px]" aria-hidden="true"></i>
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90 text-slate-300 shadow-inner">
            <i className="fas fa-file-alt text-cyan-400/80 text-[11px]" aria-hidden="true"></i>
            <span>{article.wordCount}</span>
          </span>
          {article.author && (
            <span className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90 text-slate-300 shadow-inner">
              <i className="fas fa-user-edit text-slate-400 text-[11px]" aria-hidden="true"></i>
              <span>{article.author}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`relative z-10 flex gap-3 shrink-0 ${isList ? 'w-full sm:w-auto mt-4 sm:mt-0' : 'mt-auto pt-4'}`}>
        <button 
          className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-slate-950 font-bold font-mono text-xs px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.65)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          onClick={() => onSelect(article)}
        >
          <i className="fas fa-book-open text-xs" aria-hidden="true"></i>
          <span>Read Paper</span>
        </button>

        <button 
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            isPlaying && !isPaused
              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.7)]' 
              : isPlaying && isPaused
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
              : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]'
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
        <div className="relative z-10 w-full h-1.5 bg-slate-900 rounded-full mt-5 overflow-hidden border border-slate-800 shadow-inner">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress || 0}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-200 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.9)]"
          />
        </div>
      )}
    </motion.article>
  );
};

export default ArticleCard;
