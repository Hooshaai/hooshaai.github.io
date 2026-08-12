import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-3 tracking-tight text-white">Research Dashboard</h1>
        <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Cluster ID: <span className="text-gray-300">H100-SIGMA-9</span></p>
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase flex items-center text-gray-400">
          <i className="fas fa-microchip text-gray-500 mr-3"></i> 8x NVIDIA H100
        </span>
        <span className="px-5 py-2.5 bg-white/5 text-gray-300 border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase flex items-center">
          <span className="w-2 h-2 rounded-full bg-gray-400 mr-3 animate-pulse"></span>
          Online
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
