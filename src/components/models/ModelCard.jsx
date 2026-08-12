import { motion } from 'framer-motion';

const ModelCard = ({ model, index, onDownload }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white/[0.03] p-8 rounded-3xl border border-white/20 flex flex-col hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden shadow-lg"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white group-hover:text-gray-200 transition-colors tracking-tight leading-tight">
            {model.name}
          </h3>
          <span className="bg-white/10 text-[9px] px-2.5 py-1 rounded-md border border-white/20 text-gray-200 font-mono tracking-widest uppercase ml-4 shrink-0 font-bold">
            {model.precision}
          </span>
        </div>
        
        <div className="flex flex-col gap-4 mb-8 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light">Architecture</span>
            <span className="text-gray-200 font-mono text-xs">{model.type}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light">Parameters</span>
            <span className="text-gray-200 font-mono text-xs">{model.params}</span>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-light">Storage</span>
            <span className="text-gray-200 font-mono text-xs flex items-center gap-2">
              <i className="fas fa-hdd text-gray-400"></i> {model.size}
            </span>
          </div>
        </div>
        
        <button 
          className="mt-auto relative w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
          onClick={() => onDownload(model)}
        >
          <i className="fas fa-download"></i> Get Weights
        </button>
      </div>
    </motion.div>
  );
};

export default ModelCard;
