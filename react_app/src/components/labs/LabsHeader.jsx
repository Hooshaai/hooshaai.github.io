import React from 'react';

const LabsHeader = () => {
  return (
    <div className="text-center mb-20">
      <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-8 tracking-tighter leading-tight text-white">
        Interactive AI Learning Labs
      </h1>
      <p className="text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide font-light">
        Explore the mathematical foundations of Hoosha AI research through real-time visualizations.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        {['4 Simulations', 'Real-time Canvas', 'KaTeX Math', 'Open Source'].map(badge => (
          <span key={badge} className="bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LabsHeader;
