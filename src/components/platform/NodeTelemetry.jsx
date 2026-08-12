import React, { useState, useEffect } from 'react';

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

  // Thermal Color helper
  const getThermalStatus = (temp) => {
    if (temp >= 78) {
      return {
        label: 'CRITICAL',
        badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse',
        strokeColor: '#ef4444',
        textColor: 'text-rose-400',
        cardBorder: 'hover:border-rose-500/50',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]'
      };
    }
    if (temp >= 65) {
      return {
        label: 'WARM',
        badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        strokeColor: '#f59e0b',
        textColor: 'text-amber-400',
        cardBorder: 'hover:border-amber-500/50',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]'
      };
    }
    return {
      label: 'COOL',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      strokeColor: '#10b981',
      textColor: 'text-emerald-400',
      cardBorder: 'hover:border-emerald-500/50',
      glow: ''
    };
  };

  // Trigger simulated thermal spike
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

  // SVG Circular Gauge Component
  const RadialGauge = ({ value, max = 100, size = 68, strokeWidth = 6, strokeColor = '#ffffff', label = '' }) => {
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
            stroke="rgba(255, 255, 255, 0.1)"
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
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold font-mono text-white leading-none">
            {typeof value === 'number' ? value.toFixed(0) : value}
          </span>
          {label && <span className="text-[8px] text-zinc-400 font-mono tracking-tighter uppercase mt-0.5">{label}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 font-mono">
      {/* Header & Cluster Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <i className="fas fa-microchip text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                Node Telemetry
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                  SXM5 Cluster
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time hardware utilization & thermal dynamics</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
          >
            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
            {isPaused ? 'Paused' : 'Live'}
          </button>

          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="bg-zinc-900 text-zinc-200 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
          >
            <option value={500}>0.5s rate</option>
            <option value={1000}>1.0s rate</option>
            <option value={2000}>2.0s rate</option>
          </select>

          <button
            onClick={triggerSpike}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            title="Inject load surge to test thermal color response"
          >
            <i className="fas fa-fire text-rose-400"></i> Thermal Surge
          </button>
        </div>
      </div>

      {/* Cluster Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Avg Temp</div>
          <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            {avgTemp}°C
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${getThermalStatus(parseFloat(avgTemp)).badgeBg}`}>
              {getThermalStatus(parseFloat(avgTemp)).label}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Avg Core Load</div>
          <div className="text-xl font-bold text-white mt-1">{avgUsage}%</div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Compute</div>
          <div className="text-xl font-bold text-white mt-1">{totalTflops} <span className="text-xs text-zinc-400">TFLOPS</span></div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Power Draw</div>
          <div className="text-xl font-bold text-white mt-1">{totalPower} <span className="text-xs text-zinc-400">kW</span></div>
        </div>
      </div>

      {/* GPU Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTelemetry.map(gpu => {
          const thermal = getThermalStatus(gpu.temp);

          return (
            <div
              key={gpu.id}
              onClick={() => setSelectedGpu(gpu)}
              className={`bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-zinc-500 cursor-pointer ${thermal.glow}`}
            >
              {/* Top Accent bar reflecting GPU Core Usage */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${gpu.usage}%`,
                    backgroundColor: thermal.strokeColor
                  }}
                />
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-start pt-1 mb-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    GPU #{gpu.id}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate max-w-[110px]">H100 SXM5</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold tracking-wider ${thermal.badgeBg}`}>
                  {gpu.temp.toFixed(1)}°C
                </span>
              </div>

              {/* Center Thermal & Load Radial Gauge */}
              <div className="flex items-center justify-around my-2 py-2 border-y border-zinc-800/80">
                <RadialGauge
                  value={gpu.usage}
                  max={100}
                  size={64}
                  strokeWidth={5}
                  strokeColor={thermal.strokeColor}
                  label="Core"
                />
                
                <div className="space-y-1.5 text-right">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Power</div>
                    <div className="text-xs font-bold text-zinc-200">{gpu.power.toFixed(0)} W</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">TFLOPS</div>
                    <div className="text-xs font-bold text-zinc-200">{gpu.tflops.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* VRAM Progress Bar */}
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>VRAM</span>
                  <span className="text-zinc-200 font-bold">{gpu.vram.toFixed(1)} / 80 GB</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-200 h-full transition-all duration-500"
                    style={{ width: `${(gpu.vram / 80) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer bandwidth & fan info */}
              <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider pt-3 mt-3 border-t border-zinc-800/60">
                <span>BW: <strong className="text-zinc-300">{(gpu.memory_bw / 1000).toFixed(2)} TB/s</strong></span>
                <span>Fan: <strong className="text-zinc-300">{gpu.fan}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* GPU Detail Modal if selected */}
      {selectedGpu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative font-mono">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  NVIDIA H100 SXM5 — GPU #{selectedGpu.id}
                </h3>
                <p className="text-xs text-zinc-400">Detailed Telemetry Diagnostics</p>
              </div>
              <button
                onClick={() => setSelectedGpu(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Temperature</span>
                <span className="text-base font-bold text-white">{selectedGpu.temp.toFixed(1)}°C</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Core Load</span>
                <span className="text-base font-bold text-white">{selectedGpu.usage.toFixed(1)}%</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">VRAM Allocation</span>
                <span className="text-base font-bold text-white">{selectedGpu.vram.toFixed(2)} GB</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Memory Bandwidth</span>
                <span className="text-base font-bold text-white">{selectedGpu.memory_bw.toFixed(0)} GB/s</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Power Consumption</span>
                <span className="text-base font-bold text-white">{selectedGpu.power.toFixed(0)} W</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Compute Output</span>
                <span className="text-base font-bold text-white">{selectedGpu.tflops.toFixed(0)} TFLOPS</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGpu(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
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
