import React, { useState, useEffect } from 'react';
import { Cpu, Thermometer, Zap, Activity, Flame, Pause, Play, X } from 'lucide-react';

const NodeTelemetry = ({ telemetry: initialTelemetry }) => {
  const [telemetry, setTelemetry] = useState(
    initialTelemetry ||
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `NVIDIA H100 SXM5 #${i}`,
        temp: 42 + Math.random() * 20,
        vram: 25 + Math.random() * 45,
        usage: 40 + Math.random() * 50,
        memory_bw: 1800 + Math.random() * 1200,
        power: 320 + Math.random() * 300,
        tflops: 450 + Math.random() * 400,
        fan: 55 + Math.floor(Math.random() * 35)
      }))
  );

  const [isPaused, setIsPaused] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [selectedGpu, setSelectedGpu] = useState(null);

  useEffect(() => {
    if (initialTelemetry || isPaused) return;

    const id = setInterval(() => {
      setTelemetry(prev =>
        prev.map(t => {
          const usageDelta = (Math.random() - 0.5) * 12;
          const newUsage = Math.min(100, Math.max(5, t.usage + usageDelta));
          const targetTemp = 35 + (newUsage / 100) * 48;
          const tempDelta = (targetTemp - t.temp) * 0.1 + (Math.random() - 0.5) * 1.5;

          return {
            ...t,
            usage: Math.round(newUsage * 10) / 10,
            temp: Math.min(92, Math.max(32, t.temp + tempDelta)),
            vram: Math.min(80, Math.max(8, t.vram + (Math.random() - 0.5) * 1.8)),
            memory_bw: Math.min(3350, Math.max(400, t.memory_bw + (Math.random() - 0.5) * 150)),
            power: Math.min(700, Math.max(100, (newUsage / 100) * 550 + 120 + (Math.random() - 0.5) * 30)),
            tflops: Math.min(989, Math.max(0, (newUsage / 100) * 989)),
            fan: Math.min(100, Math.max(30, Math.round(t.temp * 1.1)))
          };
        })
      );
    }, refreshInterval);

    return () => clearInterval(id);
  }, [initialTelemetry, isPaused, refreshInterval]);

  const activeTelemetry = initialTelemetry || telemetry;

  // Thermal Color helper with electric cyan as default cool nominal state
  const getThermalStatus = (temp) => {
    if (temp >= 78) {
      return {
        label: 'CRITICAL',
        badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse',
        strokeColor: '#ef4444',
        textColor: 'text-rose-400',
        cardBorder: 'hover:border-rose-500/50',
        glow: 'shadow-[0_0_25px_rgba(239,68,68,0.25)]'
      };
    }
    if (temp >= 65) {
      return {
        label: 'WARM',
        badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        strokeColor: '#f59e0b',
        textColor: 'text-amber-400',
        cardBorder: 'hover:border-amber-500/50',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]'
      };
    }
    return {
      label: 'NOMINAL',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      strokeColor: '#00f0ff',
      textColor: 'text-cyan-400',
      cardBorder: 'hover:border-cyan-500/50',
      glow: 'hover:shadow-[0_0_25px_rgba(0,240,255,0.18)]'
    };
  };

  // Trigger simulated thermal surge
  const triggerSpike = () => {
    setTelemetry(prev =>
      prev.map((t, idx) =>
        idx === 2 || idx === 6
          ? { ...t, temp: 84.5, usage: 99.2, power: 685, tflops: 980 }
          : t
      )
    );
  };

  // Summary Metrics
  const avgTemp = (activeTelemetry.reduce((acc, g) => acc + g.temp, 0) / activeTelemetry.length).toFixed(1);
  const totalPower = (activeTelemetry.reduce((acc, g) => acc + g.power, 0) / 1000).toFixed(2);
  const totalTflops = activeTelemetry.reduce((acc, g) => acc + g.tflops, 0).toFixed(0);
  const avgUsage = (activeTelemetry.reduce((acc, g) => acc + g.usage, 0) / activeTelemetry.length).toFixed(1);

  // SVG Circular Gauge Component with electric cyan glow defs
  const RadialGauge = ({ value, max = 100, size = 72, strokeWidth = 6, strokeColor = '#00f0ff', label = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${strokeColor})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold font-mono text-white leading-none">
            {typeof value === 'number' ? value.toFixed(0) : value}%
          </span>
          {label && <span className="text-[8px] text-cyan-400/80 font-mono tracking-wider uppercase mt-0.5">{label}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-6 font-mono relative overflow-hidden">
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2.5">
              Node Telemetry
              <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                SXM5 Cluster
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time hardware utilization & thermal dynamics</p>
          </div>
        </div>

        {/* Telemetry Control Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
            {isPaused ? 'Paused' : 'Live Stream'}
          </button>

          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="bg-zinc-900/90 text-zinc-200 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value={500}>0.5s rate</option>
            <option value={1000}>1.0s rate</option>
            <option value={2000}>2.0s rate</option>
          </select>

          <button
            onClick={triggerSpike}
            className="px-3.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
            title="Inject load surge to test thermal color response"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Surge Test
          </button>
        </div>
      </div>

      {/* Cluster KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/70 backdrop-blur-md border border-cyan-500/15 p-4 rounded-2xl">
        <div className="space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-cyan-400" /> Avg Temp
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            {avgTemp}°C
            <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${getThermalStatus(parseFloat(avgTemp)).badgeBg}`}>
              {getThermalStatus(parseFloat(avgTemp)).label}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" /> Avg Core Load
          </div>
          <div className="text-xl font-bold text-cyan-300">{avgUsage}%</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> Total Compute
          </div>
          <div className="text-xl font-bold text-white">{totalTflops} <span className="text-xs text-cyan-400/80 font-semibold">TFLOPS</span></div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Power Draw
          </div>
          <div className="text-xl font-bold text-white">{totalPower} <span className="text-xs text-zinc-400">kW</span></div>
        </div>
      </div>

      {/* GPU Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTelemetry.map(gpu => {
          const thermal = getThermalStatus(gpu.temp);

          return (
            <div
              key={gpu.id}
              onClick={() => setSelectedGpu(gpu)}
              className={`bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 cursor-pointer ${thermal.glow}`}
            >
              {/* Top Electric Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${gpu.usage}%`,
                    backgroundColor: thermal.strokeColor,
                    boxShadow: `0 0 10px ${thermal.strokeColor}`
                  }}
                />
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-start pt-1 mb-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></span>
                    GPU #{gpu.id}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono truncate">H100 SXM5</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold tracking-wider ${thermal.badgeBg}`}>
                  {gpu.temp.toFixed(1)}°C
                </span>
              </div>

              {/* Radial Core Gauge */}
              <div className="flex items-center justify-around my-2 py-2 border-y border-zinc-800/80">
                <RadialGauge
                  value={gpu.usage}
                  max={100}
                  size={68}
                  strokeWidth={5}
                  strokeColor={thermal.strokeColor}
                  label="Core"
                  id={`gpu-gauge-${gpu.id}`}
                />

                <div className="space-y-1.5 text-right">
                  <div>
                    <div className="text-[9px] text-zinc-400 uppercase font-bold">Power</div>
                    <div className="text-xs font-bold text-cyan-200">{gpu.power.toFixed(0)} W</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-400 uppercase font-bold">Compute</div>
                    <div className="text-xs font-bold text-white">{gpu.tflops.toFixed(0)} TFLOPS</div>
                  </div>
                </div>
              </div>

              {/* VRAM Progress Bar */}
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>VRAM</span>
                  <span className="text-cyan-300 font-bold">{gpu.vram.toFixed(1)} / 80 GB</span>
                </div>
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full transition-all duration-500 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    style={{ width: `${(gpu.vram / 80) * 100}%` }}
                  />
                </div>
              </div>

              {/* Footer info */}
              <div className="flex justify-between items-center text-[9px] text-zinc-400 uppercase tracking-wider pt-3 mt-3 border-t border-zinc-800/60">
                <span>BW: <strong className="text-white">{(gpu.memory_bw / 1000).toFixed(2)} TB/s</strong></span>
                <span>Fan: <strong className="text-white">{gpu.fan}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* GPU Detail Inspector Modal */}
      {selectedGpu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative font-mono">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  NVIDIA H100 SXM5 — GPU #{selectedGpu.id}
                </h3>
                <p className="text-xs text-zinc-400">Detailed Telemetry Diagnostics</p>
              </div>
              <button
                onClick={() => setSelectedGpu(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Temperature</span>
                <span className="text-base font-bold text-cyan-400">{selectedGpu.temp.toFixed(1)}°C</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Core Load</span>
                <span className="text-base font-bold text-white">{selectedGpu.usage.toFixed(1)}%</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">VRAM Allocation</span>
                <span className="text-base font-bold text-white">{selectedGpu.vram.toFixed(2)} GB</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Memory Bandwidth</span>
                <span className="text-base font-bold text-white">{selectedGpu.memory_bw.toFixed(0)} GB/s</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Power Draw</span>
                <span className="text-base font-bold text-white">{selectedGpu.power.toFixed(0)} W</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Compute Output</span>
                <span className="text-base font-bold text-white">{selectedGpu.tflops.toFixed(0)} TFLOPS</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGpu(null)}
                className="px-5 py-2.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeTelemetry;
