import { motion, AnimatePresence } from 'framer-motion';

const TTSBar = () => {
  // In a real app, this would read from global state or context
  // but for now we'll just mock it as hidden
  const isPlaying = false; 

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-gray-700 p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6"
        >
          <div className="w-12 h-12 bg-cyan-900/50 rounded-full flex items-center justify-center text-cyan-400">
            <i className="fas fa-podcast text-xl"></i>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="font-bold text-sm truncate">Playing Article Title</div>
            <div className="text-xs text-cyan-400 truncate">Author Name</div>
          </div>

          <div className="flex gap-4 text-gray-300">
            <button className="hover:text-white"><i className="fas fa-step-backward"></i></button>
            <button className="text-white hover:text-cyan-400 text-xl"><i className="fas fa-pause"></i></button>
            <button className="hover:text-white"><i className="fas fa-step-forward"></i></button>
          </div>

          <button className="text-gray-500 hover:text-red-400 ml-4 border-l border-gray-800 pl-4"><i className="fas fa-times"></i></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TTSBar;
