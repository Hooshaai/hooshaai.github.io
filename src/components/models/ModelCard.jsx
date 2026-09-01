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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col justify-between p-7 md:p-8 rounded-3xl bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-black/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(0,240,255,0.18)]"
    >
      {/* Top Accent Beam */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_12px_rgba(0,240,255,1)]" 
      />

      {/* Ambient Corner Glow */}
      <div 
        aria-hidden="true" 
        className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 group-hover:scale-125 transition-all duration-500" 
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-slate-100 group-hover:text-cyan-300 transition-colors tracking-tight leading-tight mb-1">
              {safeName}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span>Context:</span>
              <strong className="text-cyan-300 font-semibold">{model?.context || 'Unknown'}</strong>
            </span>
          </div>

          <span className="bg-cyan-500/10 text-cyan-300 text-[10px] px-3 py-1 rounded-full border border-cyan-500/30 font-mono tracking-widest uppercase font-bold shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.12)]">
            {safePrecision}
          </span>
        </div>
        
        {/* Specifications List */}
        <div className="flex flex-col gap-3 mb-6 flex-grow">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-400 font-light">Architecture</span>
            <span className="text-cyan-300 font-mono font-medium bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
              {safeType}
            </span>
          </div>

          <div className="w-full h-px bg-slate-800/80"></div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-400 font-light">Active Parameters</span>
            <span className="text-white font-mono font-bold bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
              {safeParams}
            </span>
          </div>

          <div className="w-full h-px bg-slate-800/80"></div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-400 font-light">VRAM / Checkpoint Size</span>
            <span className="text-slate-300 font-mono flex items-center gap-1.5">
              <i className="fas fa-microchip text-cyan-400 text-[10px]"></i>
              <span>{safeMemory} / {safeSize}</span>
            </span>
          </div>

          {/* Benchmark Badges Preview */}
          {(mmluScore !== undefined || mathScore !== undefined) && (
            <>
              <div className="w-full h-px bg-slate-800/80"></div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-light">MMLU / MATH</span>
                <div className="flex items-center gap-2 font-mono">
                  {mmluScore !== undefined && mmluScore !== '-' && (
                    <span className="text-emerald-300 font-semibold bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                      MMLU {mmluScore}
                    </span>
                  )}
                  {mathScore !== undefined && mathScore !== '-' && (
                    <span className="text-cyan-300 font-semibold bg-cyan-500/15 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                      MATH {mathScore}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Electric Cyan Action Button */}
        <button 
          className="mt-auto relative w-full bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-slate-950 py-3.5 rounded-xl font-bold font-mono text-xs shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.65)] active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          onClick={() => onDownload && onDownload(model)}
        >
          <i className="fas fa-download text-xs" aria-hidden="true"></i>
          <span>Get Weights & Checkpoints</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ModelCard;
