import React, { useState } from 'react';
import LabsHeader from '../components/labs/LabsHeader';
import CFMSimulator from '../components/labs/CFMSimulator';
import GRPOSimulator from '../components/labs/GRPOSimulator';
import DiffAttnSimulator from '../components/labs/DiffAttnSimulator';
import RAGUncertaintySimulator from '../components/labs/RAGUncertaintySimulator';
import SEO from '../components/common/SEO';

export default function Labs() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen relative z-10 font-sans text-white">
      <SEO 
        title="Interactive AI Research Labs & Simulators"
        description="Interact with continuous flow matching (CFM), GRPO policy alignment, Differential Attention, and RAG epistemic uncertainty visual simulators."
        keywords="CFM Simulator, GRPO Policy Alignment, Differential Attention, Epistemic Uncertainty, KaTeX Math Simulators"
      />

      {/* Ambient background lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Interactive Header & Filtering */}
      <LabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Simulators Container */}
      <div className="space-y-12">
        {(activeTab === 'all' || activeTab === 'cfm') && <CFMSimulator />}
        {(activeTab === 'all' || activeTab === 'grpo') && <GRPOSimulator />}
        {(activeTab === 'all' || activeTab === 'diffattn') && <DiffAttnSimulator />}
        {(activeTab === 'all' || activeTab === 'rag') && <RAGUncertaintySimulator />}
      </div>

      {/* Footer Info Box */}
      <div className="mt-20 text-center border-t border-cyan-500/20 pt-8 text-gray-500 font-mono text-xs">
        <p className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Hoosha AI Research Labs — Built with React, Tailwind CSS, KaTeX & Canvas API
        </p>
      </div>
    </div>
  );
}


