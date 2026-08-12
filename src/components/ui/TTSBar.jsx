import { motion, AnimatePresence } from 'framer-motion';
import useTTSPlayer from '../../hooks/useTTSPlayer';

const TTSBar = () => {
  const {
    isPlaying,
    isPaused,
    currentArticle,
    progress,
    togglePlay,
    stop,
    next,
    prev,
    playbackRate,
    changePlaybackRate,
    voices,
    selectedVoice,
    changeVoice,
  } = useTTSPlayer();

  if (!currentArticle) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-950/95 backdrop-blur-2xl border border-gray-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 flex flex-col md:flex-row items-center gap-4 max-w-3xl w-[92%] font-mono text-left"
      >
        {/* Progress Bar Header */}
        <div className="absolute top-0 left-4 right-4 h-1 bg-gray-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto flex-1 min-w-0">
          {/* Animated Podcast Icon or Equalizer */}
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shrink-0 relative overflow-hidden">
            {isPlaying && !isPaused ? (
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-3"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-5"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-4"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms] h-2"></span>
              </div>
            ) : (
              <i className="fas fa-podcast text-lg"></i>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs text-white truncate font-['Space_Grotesk'] tracking-wide">
              {currentArticle.title}
            </div>
            <div className="text-[10px] text-cyan-400/90 truncate flex items-center gap-2 mt-0.5">
              <span>{currentArticle.author || 'Hoosha AI Research'}</span>
              <span>•</span>
              <span className="bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-gray-400">
                {currentArticle.categoryName || 'Audio Journal'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={prev} 
            title="Previous Dispatch"
            aria-label="Previous Dispatch"
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
          >
            <i className="fas fa-step-backward text-xs"></i>
          </button>

          <button 
            onClick={() => togglePlay(currentArticle)} 
            title={isPlaying && !isPaused ? 'Pause Audio' : 'Play Audio'}
            aria-label={isPlaying && !isPaused ? 'Pause Audio' : 'Play Audio'}
            className="w-11 h-11 rounded-xl bg-cyan-400 text-black flex items-center justify-center text-base font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan-300 transition-all hover:scale-105"
          >
            <i className={`fas ${isPlaying && !isPaused ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
          </button>

          <button 
            onClick={next} 
            title="Next Dispatch"
            aria-label="Next Dispatch"
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
          >
            <i className="fas fa-step-forward text-xs"></i>
          </button>
        </div>

        {/* Right Settings Cluster */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 border-l border-gray-800 pl-3">
          {/* Speed Selector */}
          <select 
            id="tts-bar-speed-select"
            name="ttsBarSpeed"
            aria-label="Audio playback speed"
            value={playbackRate}
            onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
            className="bg-gray-900 border border-gray-800 text-[10px] text-gray-300 rounded-lg px-2 py-1.5 outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="0.8">0.8x</option>
            <option value="1">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>

          {/* Voice Selector */}
          {voices.length > 0 && (
            <select 
              id="tts-bar-voice-select"
              name="ttsBarVoice"
              aria-label="Select voice"
              value={selectedVoice?.name || ''}
              onChange={(e) => changeVoice(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-[10px] text-gray-300 rounded-lg px-2 py-1.5 outline-none focus:border-cyan-400 max-w-[110px] truncate cursor-pointer"
            >
              {voices.map(v => (
                <option key={v.name} value={v.name} className="bg-gray-950 text-white">
                  {v.name.replace('Google', '').replace('Microsoft', '').trim()}
                </option>
              ))}
            </select>
          )}

          {/* Close Player */}
          <button 
            onClick={stop} 
            title="Close Audio Player"
            aria-label="Close Audio Player"
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-colors ml-1"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TTSBar;

