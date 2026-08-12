import { motion } from 'framer-motion';

const ArticleCard = ({ article, isPlaying, onSelect, onTogglePlay }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3 }}
      key={article.id} 
      className={`flex flex-col p-8 rounded-3xl bg-white/[0.02] border ${isPlaying ? 'border-gray-400' : 'border-white/10 hover:border-white/30'} transition-all duration-300 group`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="text-[10px] font-mono tracking-widest text-gray-400 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 uppercase">
          {article.categoryName}
        </div>
        {isPlaying && (
          <div className="text-gray-400 flex items-center gap-1">
            <span className="w-1 h-3 bg-gray-400 rounded-full animate-pulse"></span>
            <span className="w-1 h-4 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-4 flex-1 text-white group-hover:text-gray-300 transition-colors leading-snug tracking-tight">
        {article.title}
      </h3>
      <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed tracking-wide font-light">
        {article.snippet}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500 mb-8 font-mono tracking-widest bg-black p-3.5 rounded-xl border border-white/10">
        <span className="flex items-center gap-2">
          <i className="fas fa-clock text-gray-600"></i>
          {article.readTime}
        </span>
        <span className="flex items-center gap-2">
          <i className="fas fa-file-alt text-gray-600"></i>
          {article.wordCount}
        </span>
      </div>

      <div className="flex gap-4 mt-auto">
        <button 
          className="flex-1 bg-white text-black py-3.5 rounded-xl font-bold tracking-wide hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
          onClick={() => onSelect(article)}
        >
          <i className="fas fa-book-open text-sm"></i> Read
        </button>
        <button 
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg transition-colors ${isPlaying ? 'bg-gray-200 text-black' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30'}`}
          onClick={() => onTogglePlay(article)}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
      </div>
      
      {isPlaying && (
        <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(10, Math.random() * 80)}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gray-400 rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

export default ArticleCard;
