import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConvergenceCharts = ({ chartData: initialChartData }) => {
  const [chartData, setChartData] = useState(
    initialChartData ||
      Array.from({ length: 25 }, (_, i) => ({
        step: i * 100,
        loss: parseFloat((2.5 * Math.exp(-i * 0.08) + 0.15 + Math.random() * 0.05).toFixed(4)),
        velocity_field: parseFloat((0.8 * Math.exp(-i * 0.06) + 0.05 + Math.random() * 0.03).toFixed(4)),
        lr: parseFloat((0.001 * Math.pow(0.95, i)).toFixed(6))
      }))
  );

  const [isLive, setIsLive] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('both');

  useEffect(() => {
    if (initialChartData || !isLive) return;

    const id = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastStep = newData[newData.length - 1].step;
        const lastLoss = newData[newData.length - 1].loss;
        const lastVel = newData[newData.length - 1].velocity_field;
        const lastLr = newData[newData.length - 1].lr;

        const nextLoss = Math.max(0.08, lastLoss - (Math.random() * 0.015 - 0.004));
        const nextVel = Math.max(0.02, lastVel - (Math.random() * 0.008 - 0.002));
        const nextLr = Math.max(0.00001, lastLr * 0.995);

        newData.push({
          step: lastStep + 100,
          loss: parseFloat(nextLoss.toFixed(4)),
          velocity_field: parseFloat(nextVel.toFixed(4)),
          lr: parseFloat(nextLr.toFixed(6))
        });
        return newData;
      });
    }, 1200);

    return () => clearInterval(id);
  }, [initialChartData, isLive]);

  const activeChartData = initialChartData || chartData;

  const currentLoss = activeChartData[activeChartData.length - 1]?.loss || 0;
  const initialLoss = activeChartData[0]?.loss || 1;
  const minLoss = Math.min(...activeChartData.map(d => d.loss)).toFixed(4);
  const lossReduction = (((initialLoss - currentLoss) / initialLoss) * 100).toFixed(1);
  const currentStep = activeChartData[activeChartData.length - 1]?.step || 0;
  const currentVel = activeChartData[activeChartData.length - 1]?.velocity_field || 0;

  const handleReset = () => {
    setChartData(
      Array.from({ length: 25 }, (_, i) => ({
        step: i * 100,
        loss: parseFloat((2.5 * Math.exp(-i * 0.08) + 0.15 + Math.random() * 0.05).toFixed(4)),
        velocity_field: parseFloat((0.8 * Math.exp(-i * 0.06) + 0.05 + Math.random() * 0.03).toFixed(4)),
        lr: parseFloat((0.001 * Math.pow(0.95, i)).toFixed(6))
      }))
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
          <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">
            Step {label}
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex justify-between items-center gap-4">
              <span style={{ color: entry.color }} className="capitalize font-semibold">
                {entry.name.replace('_', ' ')}:
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 font-mono">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
            <i className="fas fa-chart-line text-zinc-300 text-lg"></i> Convergence Analytics
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Optimization trajectory & gradient velocity streaming</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
              isLive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
            {isLive ? 'Live Convergence' : 'Paused'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 rounded-xl transition-colors text-xs"
            title="Reset Training Curves"
          >
            <i className="fas fa-redo-alt"></i>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Current Loss</div>
          <div className="text-xl font-bold text-white mt-1">{currentLoss.toFixed(4)}</div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Min Loss</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{minLoss}</div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Loss Reduction</div>
          <div className="text-xl font-bold text-white mt-1">-{lossReduction}%</div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Current Step</div>
          <div className="text-xl font-bold text-zinc-200 mt-1">{currentStep}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loss Curve */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors shadow-inner flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span> Loss Trajectory
            </h3>
            <span className="text-[10px] text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded font-mono">
              Cross-Entropy
            </span>
          </div>
          <div className="h-56 w-full bg-black rounded-xl p-2 border border-zinc-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="step" stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="loss" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#lossGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Field */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors shadow-inner flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Velocity Field Magnitude
            </h3>
            <span className="text-[10px] text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded font-mono">
              Grad ||g||
            </span>
          </div>
          <div className="h-56 w-full bg-black rounded-xl p-2 border border-zinc-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="velGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="step" stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="velocity_field" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#velGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvergenceCharts;
