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
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-slate-950/70 p-6 md:p-8 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 flex flex-col transition-all duration-300 overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-xl relative"
    >
      {/* Background Hover Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-tight mb-1">
              {safeName}
            </h3>
            <span className="inline-block text-[11px] text-gray-400 font-mono">
              Context: <strong className="text-cyan-300">{model?.context || 'Unknown'}</strong>
            </span>
          </div>
          <span className="bg-cyan-500/10 text-cyan-300 text-[10px] px-3 py-1 rounded-full border border-cyan-500/30 font-mono tracking-wider uppercase shrink-0 font-bold shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            {safePrecision}
          </span>
        </div>
        
        {/* Specifications Grid */}
        <div className="flex flex-col gap-3.5 mb-6 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">Architecture</span>
            <span className="text-cyan-300 font-mono text-xs bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">{safeType}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">Parameters</span>
            <span className="text-white font-mono text-xs font-bold">{safeParams}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">VRAM / Storage</span>
            <span className="text-gray-300 font-mono text-xs flex items-center gap-1.5">
              <i className="fas fa-microchip text-cyan-400 text-[10px]"></i> {safeMemory} / {safeSize}
            </span>
          </div>

          {/* Benchmark Badges Preview */}
          {(mmluScore !== undefined || mathScore !== undefined) && (
            <>
              <div className="w-full h-px bg-white/10"></div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400 font-light">MMLU / MATH</span>
                <div className="flex items-center gap-2 font-mono">
                  {mmluScore !== undefined && mmluScore !== '-' && (
                    <span className="text-emerald-300 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                      MMLU: {mmluScore}
                    </span>
                  )}
                  {mathScore !== undefined && mathScore !== '-' && (
                    <span className="text-cyan-300 font-semibold bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                      MATH: {mathScore}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Electric Cyan Action Button */}
        <button 
          className="mt-auto relative w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black py-3 rounded-xl font-bold font-mono text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer uppercase tracking-wider"
          onClick={() => onDownload && onDownload(model)}
        >
          <i className="fas fa-download text-xs"></i>
          <span>Get Weights</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ModelCard;

