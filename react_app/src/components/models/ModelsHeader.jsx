const ModelsHeader = () => {
  return (
    <div className="text-center mb-16 relative z-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-8 tracking-tight text-white">
        Model Zoo
      </h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-gray-400 font-mono text-xs md:text-sm bg-white/[0.02] inline-flex p-4 rounded-full border border-white/10">
        <span className="flex items-center tracking-tight">
          <i className="fas fa-database text-gray-300 mr-2"></i>144.2 GB Total
        </span>
        <span className="hidden md:block w-px h-4 bg-white/10"></span>
        <span className="flex items-center tracking-tight">
          <i className="fas fa-cube text-gray-300 mr-2"></i>6 Checkpoints
        </span>
        <span className="hidden md:block w-px h-4 bg-white/10"></span>
        <span className="flex items-center tracking-tight">
          <i className="fas fa-download text-gray-300 mr-2"></i>276k+ Downloads
        </span>
      </div>
    </div>
  );
};

export default ModelsHeader;
