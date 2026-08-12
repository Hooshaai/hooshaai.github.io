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
      className="group bg-white/[0.03] p-6 md:p-8 rounded-3xl border border-white/20 flex flex-col hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden shadow-xl backdrop-blur-sm relative"
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white group-hover:text-white transition-colors tracking-tight leading-tight mb-1">
              {safeName}
            </h3>
            <span className="inline-block text-[11px] text-gray-400 font-mono">
              Context: <strong className="text-gray-200">{model?.context || 'Unknown'}</strong>
            </span>
          </div>
          <span className="bg-white/10 text-[10px] px-2.5 py-1 rounded-full border border-white/20 text-gray-200 font-mono tracking-wider uppercase shrink-0 font-bold">
            {safePrecision}
          </span>
        </div>
        
        {/* Specifications Grid */}
        <div className="flex flex-col gap-3.5 mb-6 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">Architecture</span>
            <span className="text-gray-200 font-mono text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">{safeType}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">Parameters</span>
            <span className="text-gray-200 font-mono text-xs font-semibold">{safeParams}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light text-xs">VRAM / Storage</span>
            <span className="text-gray-300 font-mono text-xs flex items-center gap-1.5">
              <i className="fas fa-microchip text-gray-500 text-[10px]"></i> {safeMemory} / {safeSize}
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
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      MMLU: {mmluScore}
                    </span>
                  )}
                  {mathScore !== undefined && mathScore !== '-' && (
                    <span className="text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      MATH: {mathScore}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Action Button */}
        <button 
          className="mt-auto relative w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-[0.99] transition-all flex justify-center items-center gap-2 shadow-md cursor-pointer"
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
