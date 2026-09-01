import { motion } from 'framer-motion';

const ModelCard = ({ model, index = 0, onDownload }) => {
  const safeName = model?.name || 'Unnamed Model';
  const safePrecision = model?.precision || 'BF16';
  const safeType = model?.type || 'General';
  const safeParams = model?.params || 'N/A';
  const safeSize = model?.size || 'Unknown';
  const safeMemory = model?.memory || 'Unknown';

  const mmluScore = model?.scores?.mmlu;
  const mathScore = model?.scores?.math;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-lg hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)] h-full"
    >
      {/* Top Accent Beam */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(0,240,255,0.8)]" 
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-slate-100 group-hover:text-cyan-300 transition-colors tracking-tight leading-tight truncate">
              {safeName}
            </h3>
            <span className="inline-block text-[11px] text-slate-400 font-mono mt-0.5">
              Context: <strong className="text-cyan-300 font-semibold">{model?.context || 'Unknown'}</strong>
            </span>
          </div>

          <span className="bg-cyan-500/10 text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-md border border-cyan-500/30 font-mono tracking-wider uppercase font-bold shrink-0">
            {safePrecision}
          </span>
        </div>
        
        {/* Specifications List */}
        <div className="flex flex-col gap-2.5 mb-5 flex-grow font-mono text-xs">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400 font-sans text-xs">Architecture</span>
            <span className="text-cyan-300 text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {safeType}
            </span>
          </div>

          <div className="w-full h-px bg-slate-800/80"></div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400 font-sans text-xs">Active Parameters</span>
            <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
              {safeParams}
            </span>
          </div>

          <div className="w-full h-px bg-slate-800/80"></div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400 font-sans text-xs">VRAM / Storage</span>
            <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
              <i className="fas fa-microchip text-cyan-400 text-[9px]"></i>
              <span>{safeMemory} / {safeSize}</span>
            </span>
          </div>

          {/* Benchmark Badges Preview */}
          {(mmluScore !== undefined || mathScore !== undefined) && (
            <>
              <div className="w-full h-px bg-slate-800/80"></div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-slate-400 font-sans text-xs">Benchmark</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {mmluScore !== undefined && mmluScore !== '-' && (
                    <span className="text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                      MMLU {mmluScore}
                    </span>
                  )}
                  {mathScore !== undefined && mathScore !== '-' && (
                    <span className="text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
                      MATH {mathScore}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Action Button */}
        <button 
          className="mt-auto w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 py-2.5 rounded-xl font-bold font-mono text-xs shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          onClick={() => onDownload && onDownload(model)}
        >
          <i className="fas fa-download text-[11px]"></i>
          <span>Get Checkpoint</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ModelCard;
