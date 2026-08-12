import React from 'react';
import { Sparkles, Cpu, Activity, Code2, PlayCircle } from 'lucide-react';

const LabsHeader = ({ activeTab, setActiveTab }) => {
  const categories = [
    { id: 'all', label: 'All Labs' },
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
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>INTERACTIVE RESEARCH LABS</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight leading-tight text-white max-w-4xl mx-auto">
        Mathematical Foundations & Visual Simulators
      </h1>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base font-light">
        Interactively manipulate equations, vector fields, policy alignment, and uncertainty metrics powering next-generation generative AI.
      </p>

      {/* Feature Badges */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mb-10 text-xs font-mono">
        <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          4 Interactive Simulators
        </span>
        <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          Hardware Scaled Canvas
        </span>
        <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Live KaTeX Formulas
        </span>
        <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full">
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          Real-time Parameter Tuning
        </span>
      </div>

      {/* Navigation Filter Tabs */}
      {setActiveTab && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap bg-zinc-950/80 p-1.5 rounded-2xl border border-zinc-800 max-w-2xl mx-auto backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-white text-black shadow-lg font-semibold scale-[1.02]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
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

