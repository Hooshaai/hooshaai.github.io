import React from 'react';
import { Sparkles, Cpu, Activity, Code2 } from 'lucide-react';

const LabsHeader = ({ activeTab, setActiveTab }) => {
  const categories = [
    { id: 'all', label: 'All Labs' },
    { id: 'linear', label: 'Linear Attention O(N)' },
    { id: 'cfm', label: 'Continuous Flow' },
    { id: 'grpo', label: 'GRPO Policy' },
    { id: 'diffattn', label: 'Diff Attention' },
    { id: 'rag', label: 'RAG Uncertainty' }
  ];

  return (
    <div className="text-center mb-16 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Status Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
        <span className="tracking-wide">INTERACTIVE RESEARCH LABS</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight leading-tight text-white max-w-4xl mx-auto bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
        Mathematical Foundations & Visual Simulators
      </h1>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base font-light">
        Interactively manipulate equations, vector fields, policy alignment, linear sub-quadratic scaling, and uncertainty metrics powering next-generation generative AI.
      </p>

      {/* Feature Badges */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mb-10 text-xs font-mono">
        <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/20 text-cyan-300 px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          5 Interactive Simulators
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          Hardware Scaled Canvas
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/20 text-amber-300 px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Live KaTeX Formulas
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/20 text-purple-300 px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          Real-time Parameter Tuning
        </span>
      </div>

      {/* Navigation Filter Tabs */}
      {setActiveTab && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap bg-slate-950/80 p-1.5 rounded-2xl border border-cyan-500/20 max-w-2xl mx-auto backdrop-blur-xl shadow-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold scale-[1.02]'
                  : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabsHeader;


