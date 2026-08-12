import React, { useState } from 'react';
import LabsHeader from '../components/labs/LabsHeader';
import CFMSimulator from '../components/labs/CFMSimulator';
import GRPOSimulator from '../components/labs/GRPOSimulator';
import DiffAttnSimulator from '../components/labs/DiffAttnSimulator';
import RAGUncertaintySimulator from '../components/labs/RAGUncertaintySimulator';

export default function Labs() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen relative z-10 font-sans text-white">
      {/* Interactive Header & Filtering */}
      <LabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Simulators Container */}
      <div className="space-y-4">
        {(activeTab === 'all' || activeTab === 'cfm') && <CFMSimulator />}
        {(activeTab === 'all' || activeTab === 'grpo') && <GRPOSimulator />}
        {(activeTab === 'all' || activeTab === 'diffattn') && <DiffAttnSimulator />}
        {(activeTab === 'all' || activeTab === 'rag') && <RAGUncertaintySimulator />}
      </div>

      {/* Footer Info Box */}
      <div className="mt-16 text-center border-t border-zinc-800/80 pt-8 text-zinc-500 font-mono text-xs">
        <p>Hoosha AI Research Labs — Built with React, Tailwind CSS, KaTeX & Canvas API</p>
      </div>
    </div>
  );
}

