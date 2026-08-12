import React, { useState, useEffect } from 'react';

const NodeTelemetry = ({ telemetry: initialTelemetry }) => {
  const [telemetry, setTelemetry] = useState(initialTelemetry || Array.from({length: 8}, (_, i) => ({
    id: i, temp: 40, vram: 10, usage: 50, memory_bw: 400, power: 150, tflops: 120
  })));

  useEffect(() => {
    if (initialTelemetry) return;
    const id = setInterval(() => {
      setTelemetry(prev => prev.map(t => ({
        ...t,
        temp: Math.min(85, Math.max(30, t.temp + (Math.random() - 0.5) * 5)),
        vram: Math.min(80, Math.max(10, t.vram + (Math.random() - 0.5) * 2)),
        usage: Math.min(100, Math.max(0, t.usage + (Math.random() - 0.5) * 15)),
        memory_bw: Math.min(3000, Math.max(100, t.memory_bw + (Math.random() - 0.5) * 200)),
        power: Math.min(700, Math.max(100, t.power + (Math.random() - 0.5) * 50)),
        tflops: Math.min(989, Math.max(0, t.tflops + (Math.random() - 0.5) * 50))
      })));
    }, 1000);
    return () => clearInterval(id);
  }, [initialTelemetry]);

  const activeTelemetry = initialTelemetry || telemetry;

  return (
    <div className="bg-white/[0.03] border border-white/20 rounded-3xl p-8 shadow-xl group">
      <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-5">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] flex items-center text-white tracking-tight">
          <i className="fas fa-server text-gray-300 mr-3"></i>Node Telemetry
        </h2>
        <span className="text-xs text-gray-300 font-mono tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20 font-bold">
          Updated Live
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {activeTelemetry.map(gpu => (
          <div key={gpu.id} className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:border-white/40">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
              <div className="h-full bg-white transition-all duration-1000" style={{width: `${gpu.usage}%`}}></div>
            </div>
            
            <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-gray-400 flex justify-between mt-2">
              <span className="text-white font-bold">GPU {gpu.id}</span>
              <span className={`${gpu.temp > 75 ? 'text-white font-bold animate-pulse' : 'text-gray-300'} transition-colors`}>{gpu.temp.toFixed(1)}°C</span>
            </div>
            
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono tracking-widest uppercase font-semibold"><span>VRAM</span> <span>{gpu.vram.toFixed(1)}GB</span></div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-1000" style={{width: `${(gpu.vram/80)*100}%`}}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-3">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="mb-1 opacity-70">Power</div>
                <div className="text-gray-200 text-xs font-bold">{gpu.power.toFixed(0)}W</div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="mb-1 opacity-70">TFLOPS</div>
                <div className="text-gray-200 text-xs font-bold">{gpu.tflops.toFixed(0)}</div>
              </div>
            </div>
            
            <div className="text-right text-2xl font-bold font-mono text-white mt-auto pt-4 border-t border-white/10 tracking-tighter">
              {gpu.usage.toFixed(0)}<span className="text-[10px] text-gray-400 ml-1 tracking-widest uppercase font-semibold">Util</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeTelemetry;
