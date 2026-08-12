import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 pb-6 border-b border-zinc-800 font-mono">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational Status: Nominal
          </span>
          <span className="text-xs text-zinc-500 font-mono">Cluster ID: <strong className="text-zinc-200">H100-SIGMA-9</strong></span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
          Platform Research Console
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl font-mono">
          Distributed GPU cluster orchestration, real-time telemetry, loss convergence tracking, and Triton/CUDA JIT compilation environment.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono tracking-wider flex items-center text-zinc-300">
          <i className="fas fa-microchip text-zinc-400 mr-2.5 text-sm"></i>
          <span>8x NVIDIA H100 (SXM5)</span>
        </div>

        <div className="px-4 py-2.5 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-mono tracking-wider flex items-center">
          <i className="fas fa-network-wired text-zinc-400 mr-2.5 text-sm"></i>
          <span>3.2 Tbps NVLink</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
