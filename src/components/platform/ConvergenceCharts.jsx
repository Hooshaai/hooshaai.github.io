import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConvergenceCharts = ({ chartData: initialChartData }) => {
  const [chartData, setChartData] = useState(initialChartData || Array.from({length: 20}, (_, i) => ({
    step: i * 100,
    loss: 2.5 * Math.exp(-i * 0.1) + Math.random() * 0.1,
    velocity_field: Math.random() * 0.5 * Math.exp(-i * 0.05)
  })));

  useEffect(() => {
    if (initialChartData) return;
    const id = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastStep = newData[newData.length - 1].step;
        const lastLoss = newData[newData.length - 1].loss;
        const lastVel = newData[newData.length - 1].velocity_field;
        newData.push({
          step: lastStep + 100,
          loss: Math.max(0.1, lastLoss - Math.random() * 0.02),
          velocity_field: Math.max(0, lastVel - Math.random() * 0.01)
        });
        return newData;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [initialChartData]);

  const activeChartData = initialChartData || chartData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] flex items-center tracking-tight text-white">
            <i className="fas fa-chart-line text-gray-400 mr-3"></i>Loss Curve
          </h2>
        </div>
        <div className="h-48 w-full bg-black rounded-xl p-2 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="step" stroke="#9ca3af50" tick={{fontSize: 10, fill: '#6b7280', fontFamily: 'monospace'}} />
              <YAxis stroke="#9ca3af50" tick={{fontSize: 10, fill: '#6b7280', fontFamily: 'monospace'}} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="loss" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] flex items-center tracking-tight text-white">
            <i className="fas fa-wave-square text-gray-400 mr-3"></i>Velocity Field
          </h2>
        </div>
        <div className="h-48 w-full bg-black rounded-xl p-2 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="step" stroke="#9ca3af50" tick={{fontSize: 10, fill: '#6b7280', fontFamily: 'monospace'}} />
              <YAxis stroke="#9ca3af50" tick={{fontSize: 10, fill: '#6b7280', fontFamily: 'monospace'}} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="velocity_field" stroke="#9ca3af" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConvergenceCharts;
