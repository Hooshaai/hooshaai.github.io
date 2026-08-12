import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const DownloadModal = ({ downloadModal, onClose, progress, speedData, copied, onCopyCode }) => {
  if (!downloadModal) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-gray-900 border border-white/10 rounded-[2rem] p-8 max-w-3xl w-full relative shadow-2xl overflow-hidden"
      >
        <button 
          className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-white/10 text-lg w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white text-2xl">
            <i className="fas fa-cube"></i>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-white">{downloadModal.name}</h2>
            <p className="text-sm text-gray-400 font-mono flex items-center gap-3 mt-1">
              <span>Size: {downloadModal.size}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-gray-300 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <i className="fas fa-check-circle text-xs"></i> SHA256 Verified
              </span>
            </p>
          </div>
        </div>
        
        <div className="mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between text-sm font-mono mb-3">
            <span className="text-gray-400">{progress >= 100 ? 'Download Complete' : 'Downloading weights (.safetensors)...'}</span>
            <span className="text-white font-bold">{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden mb-5">
            <motion.div 
              className="bg-white h-full rounded-full" 
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="h-24 w-full mt-4 bg-gray-950 rounded-xl p-2 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedData}>
                <YAxis domain={[0, 100]} hide />
                <Line type="monotone" dataKey="speed" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {progress < 100 && (
            <div className="text-right text-xs text-gray-500 mt-3 font-mono tracking-wide">
              {(speedData[speedData.length-1]?.speed || 0).toFixed(1)} MB/s
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">Wget Command</span>
              <button 
                onClick={() => onCopyCode(`wget https://huggingface.co/hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors`, 'wget')} 
                className="text-xs text-gray-300 hover:text-white font-medium transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md"
              >
                {copied === 'wget' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
              </button>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10 font-mono text-xs leading-relaxed text-gray-300 overflow-x-auto h-24 flex items-center group-hover:border-white/20 transition-colors">
              <code className="whitespace-pre-wrap">wget https://huggingface.co/hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors</code>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">Hugging Face CLI</span>
              <button 
                onClick={() => onCopyCode(`huggingface-cli download hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}`, 'hf')} 
                className="text-xs text-gray-300 hover:text-white font-medium transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md"
              >
                {copied === 'hf' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
              </button>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10 font-mono text-xs leading-relaxed text-gray-300 overflow-x-auto h-24 flex items-center group-hover:border-white/20 transition-colors">
              <code className="whitespace-pre-wrap">huggingface-cli download hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}</code>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DownloadModal;
