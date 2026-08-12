import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const DownloadModal = ({ downloadModal, onClose, progress = 0, speedData = [], copied = '', onCopyCode }) => {
  const [activeTab, setActiveTab] = useState('wget');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!downloadModal) return null;

  const safeName = downloadModal?.name || 'Model Checkpoint';
  const safeSlug = safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'model-checkpoint';
  const safeSize = downloadModal?.size || '14.2 GB';
  const safePrecision = downloadModal?.precision || 'BF16';
  const safeType = downloadModal?.type || 'Flow Matching';

  const wgetCmd = `wget https://huggingface.co/hooshaai/${safeSlug}/resolve/main/model.safetensors`;
  const hfCmd = `huggingface-cli download hooshaai/${safeSlug}`;
  const pySnippet = `from transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel = AutoModelForCausalLM.from_pretrained("hooshaai/${safeSlug}", torch_dtype="auto")\ntokenizer = AutoTokenizer.from_pretrained("hooshaai/${safeSlug}")`;

  const currentSpeed = speedData.length > 0 ? (speedData[speedData.length - 1]?.speed || 0) : 0;
  
  // Estimate ETA
  let etaText = 'Calculating...';
  if (progress >= 100) {
    etaText = 'Completed';
  } else if (currentSpeed > 0) {
    const remainingPercent = 100 - progress;
    const secondsLeft = Math.ceil(remainingPercent / (currentSpeed / 40));
    etaText = secondsLeft < 60 ? `${secondsLeft}s remaining` : `${Math.ceil(secondsLeft / 60)}m remaining`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-white/15 rounded-[2rem] p-6 md:p-8 max-w-3xl w-full relative shadow-2xl overflow-hidden my-auto"
      >
        <button 
          className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-white/10 text-base w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i className="fas fa-times"></i>
        </button>
        
        {/* Header Info */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white text-2xl shrink-0">
            <i className="fas fa-cube"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-white">{safeName}</h2>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-gray-200 px-2 py-0.5 rounded border border-white/15 uppercase">
                {safePrecision}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-mono flex flex-wrap items-center gap-2">
              <span>Size: <strong className="text-gray-200">{safeSize}</strong></span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span>Type: <strong className="text-gray-200">{safeType}</strong></span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <i className="fas fa-check-circle text-[10px]"></i> SHA256 Verified
              </span>
            </p>
          </div>
        </div>
        
        {/* Progress & Speed Chart */}
        <div className="mb-8 bg-black/40 p-6 rounded-2xl border border-white/10 shadow-inner">
          <div className="flex justify-between items-center text-xs md:text-sm font-mono mb-3">
            <span className="text-gray-300 font-medium flex items-center gap-2">
              {progress >= 100 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <i className="fas fa-check-circle"></i> Download Complete
                </span>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>Downloading weights (<code className="text-gray-400">.safetensors</code>)...</span>
                </>
              )}
            </span>
            <span className="text-white font-bold">{Math.min(100, Math.floor(progress))}%</span>
          </div>
          
          <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden mb-4 border border-white/10">
            <motion.div 
              className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-blue-500 to-white'}`} 
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="h-24 w-full bg-gray-950 rounded-xl p-2 border border-white/5 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedData}>
                <YAxis domain={[0, 100]} hide />
                <Line type="monotone" dataKey="speed" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 mt-3 font-mono tracking-wide">
            <span>Status: <strong className="text-gray-300">{etaText}</strong></span>
            {progress < 100 && (
              <span>Speed: <strong className="text-white font-bold">{currentSpeed.toFixed(1)} MB/s</strong></span>
            )}
          </div>
        </div>

        {/* Code Snippets Section */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('wget')}
                className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-colors ${
                  activeTab === 'wget' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Wget Command
              </button>
              <button 
                onClick={() => setActiveTab('hf')}
                className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-colors ${
                  activeTab === 'hf' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Hugging Face CLI
              </button>
              <button 
                onClick={() => setActiveTab('python')}
                className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 transition-colors ${
                  activeTab === 'python' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Python Code
              </button>
            </div>
            
            <button 
              onClick={() => {
                const targetText = activeTab === 'wget' ? wgetCmd : activeTab === 'hf' ? hfCmd : pySnippet;
                onCopyCode && onCopyCode(targetText, activeTab);
              }} 
              className="text-xs text-gray-300 hover:text-white font-medium transition-colors bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md mb-2 flex items-center gap-1.5"
            >
              {copied === activeTab ? (
                <>
                  <i className="fas fa-check text-emerald-400"></i>
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <i className="fas fa-copy"></i>
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-black/90 p-4 rounded-xl border border-white/10 font-mono text-xs leading-relaxed text-gray-300 overflow-x-auto min-h-20 flex items-center">
            <code className="whitespace-pre-wrap font-mono">
              {activeTab === 'wget' && wgetCmd}
              {activeTab === 'hf' && hfCmd}
              {activeTab === 'python' && pySnippet}
            </code>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DownloadModal;
