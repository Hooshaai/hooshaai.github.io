import React from 'react';
import { Cpu, Network, Activity, Radio, ShieldCheck } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="bg-zinc-950/70 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 md:p-8 mb-8 shadow-[0_0_30px_rgba(0,240,255,0.06)] relative overflow-hidden font-mono">
      {/* Subtle top cyan border glow line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Cluster Status: Nominal (100Hz Sync)
            </span>

            <span className="text-xs text-zinc-400 flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Cluster ID: <strong className="text-cyan-200">H100-SIGMA-9</strong></span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight bg-gradient-to-r from-white via-zinc-100 to-cyan-200 bg-clip-text text-transparent">
            Platform Research Console
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl font-mono leading-relaxed">
            Distributed GPU cluster orchestration, real-time hardware telemetry, loss convergence tracking, and Triton / CUDA JIT kernel compilation environment.
          </p>
        </div>

        {/* Spec Hardware Badges */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-zinc-900/80 border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl text-xs font-mono tracking-wider flex items-center gap-2.5 text-zinc-200 shadow-md transition-all">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">8x NVIDIA H100 (SXM5)</span>
          </div>

          <div className="px-4 py-2.5 bg-zinc-900/80 border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl text-xs font-mono tracking-wider flex items-center gap-2.5 text-zinc-200 shadow-md transition-all">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">3.2 Tbps NVLink-4</span>
          </div>

          <div className="px-4 py-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs font-mono tracking-wider flex items-center gap-2 text-cyan-300 shadow-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">ECC Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
