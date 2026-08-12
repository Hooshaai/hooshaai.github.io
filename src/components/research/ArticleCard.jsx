import { motion } from 'framer-motion';

const ArticleCard = ({ article, isPlaying, isPaused, progress, viewMode = 'grid', onSelect, onTogglePlay }) => {
  const isList = viewMode === 'list';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isList ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'} p-7 md:p-8 rounded-3xl bg-gray-950/70 border ${
        isPlaying 
          ? 'border-cyan-400/80 shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-gray-900/80' 
          : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/40'
      } transition-all duration-300 group relative overflow-hidden backdrop-blur-xl shadow-xl`}
    >
      {/* Top Ambient Highlight */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isPlaying ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500' : 'bg-gradient-to-r from-transparent via-gray-800 to-transparent group-hover:via-cyan-500/50'} transition-all`} />

      <div className={`flex-1 ${isList ? 'pr-0 sm:pr-8 mb-6 sm:mb-0' : ''}`}>
        <div className="flex justify-between items-center mb-5">
          <div className="text-[10px] font-mono tracking-widest text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/40 uppercase">
            {article.categoryName || 'Research'}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-500">{article.pubDate || 'Aug 2026'}</span>
            {isPlaying && (
              <div className="flex items-end gap-1 h-4 px-2 py-0.5 bg-cyan-950/60 rounded-full border border-cyan-500/40 text-cyan-400">
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-4"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3"></span>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] mb-3 text-white group-hover:text-cyan-300 transition-colors leading-snug tracking-tight">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed tracking-wide font-light">
          {article.snippet}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-mono tracking-wider">
          <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-gray-800">
            <i className="fas fa-clock text-cyan-400/80"></i>
            {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-gray-800">
            <i className="fas fa-file-alt text-purple-400/80"></i>
            {article.wordCount}
          </span>
          {article.author && (
            <span className="hidden md:flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400">
              <i className="fas fa-user-edit text-gray-500"></i>
              {article.author}
            </span>
          )}
        </div>
      </div>

      <div className={`flex gap-3 shrink-0 ${isList ? 'w-full sm:w-auto mt-4 sm:mt-0' : 'mt-8'}`}>
        <button 
          className="flex-1 sm:flex-none bg-white text-black px-6 py-3.5 rounded-xl font-bold tracking-wide hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase shadow-md hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          onClick={() => onSelect(article)}
        >
          <i className="fas fa-book-open text-xs"></i> Read Paper
        </button>
        <button 
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
            isPlaying && !isPaused
              ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]' 
              : isPlaying && isPaused
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
          }`}
          title={isPlaying && !isPaused ? 'Pause Audio' : 'Listen Article'}
          aria-label={isPlaying && !isPaused ? 'Pause Audio' : 'Listen Article'}
          onClick={() => onTogglePlay(article)}
        >
          <i className={`fas ${isPlaying && !isPaused ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
        </button>
      </div>

      {isPlaying && typeof progress === 'number' && (
        <div className="w-full h-1 bg-gray-900 rounded-full mt-5 overflow-hidden col-span-full">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
          />
        </div>
      )}
    </motion.div>
  );
};

export default ArticleCard;

