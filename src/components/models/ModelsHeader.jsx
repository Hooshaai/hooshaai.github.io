const ModelsHeader = ({ totalModels = 6, totalSize = '144.2 GB', totalDownloads = '276k+' }) => {
  return (
    <div className="text-center mb-16 relative z-10">
      {/* Radial Cyan Glow in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Status Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
        <span className="tracking-wide">VERIFIED CHECKPOINTS & WEIGHTS</span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
        Model Zoo
      </h1>

      <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light mb-8">
        Production-ready model weights, custom Triton kernels, and open foundation checkpoints fine-tuned for high-performance reasoning and inference.
      </p>

      {/* Glassmorphic Stats Bar */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-300 font-mono text-xs md:text-sm bg-slate-900/60 inline-flex p-3 md:px-8 md:py-4 rounded-2xl md:rounded-full border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <span className="flex items-center tracking-tight hover:text-cyan-300 transition-colors cursor-default">
          <i className="fas fa-database text-cyan-400 mr-2 text-xs"></i>
          <span className="text-gray-400 mr-1.5">Storage:</span>
          <strong className="text-white font-bold">{totalSize}</strong>
        </span>

        <span className="hidden md:block w-px h-4 bg-cyan-500/20"></span>

        <span className="flex items-center tracking-tight hover:text-cyan-300 transition-colors cursor-default">
          <i className="fas fa-cube text-cyan-400 mr-2 text-xs"></i>
          <span className="text-gray-400 mr-1.5">Checkpoints:</span>
          <strong className="text-white font-bold">{totalModels}</strong>
        </span>

        <span className="hidden md:block w-px h-4 bg-cyan-500/20"></span>

        <span className="flex items-center tracking-tight hover:text-cyan-300 transition-colors cursor-default">
          <i className="fas fa-download text-cyan-400 mr-2 text-xs"></i>
          <span className="text-gray-400 mr-1.5">Downloads:</span>
          <strong className="text-white font-bold">{totalDownloads}</strong>
        </span>
      </div>
    </div>
  );
};

export default ModelsHeader;

