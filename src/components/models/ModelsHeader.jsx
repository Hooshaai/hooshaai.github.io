const ModelsHeader = ({ totalModels = 6, totalSize = '144.2 GB', totalDownloads = '276k+' }) => {
  return (
    <div className="text-center mb-16 relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Verified Checkpoints & Weights</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight text-white">
        Model Zoo
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light mb-8">
        Production-ready model weights, custom kernels, and open foundation checkpoints fine-tuned for high-performance reasoning and inference.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-3 md:gap-8 text-gray-300 font-mono text-xs md:text-sm bg-white/[0.03] inline-flex p-3 md:p-4 rounded-2xl md:rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
        <span className="flex items-center tracking-tight">
          <i className="fas fa-database text-gray-400 mr-2"></i>
          <strong className="text-white mr-1">{totalSize}</strong> Total Storage
        </span>
        <span className="hidden md:block w-px h-4 bg-white/15"></span>
        <span className="flex items-center tracking-tight">
          <i className="fas fa-cube text-gray-400 mr-2"></i>
          <strong className="text-white mr-1">{totalModels}</strong> Checkpoints
        </span>
        <span className="hidden md:block w-px h-4 bg-white/15"></span>
        <span className="flex items-center tracking-tight">
          <i className="fas fa-download text-gray-400 mr-2"></i>
          <strong className="text-white mr-1">{totalDownloads}</strong> Downloads
        </span>
      </div>
    </div>
  );
};

export default ModelsHeader;
