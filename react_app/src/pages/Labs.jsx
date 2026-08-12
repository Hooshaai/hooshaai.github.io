import React from 'react';
import LabsHeader from '../components/labs/LabsHeader';
import CFMSimulator from '../components/labs/CFMSimulator';
import GRPOSimulator from '../components/labs/GRPOSimulator';
import DiffAttnSimulator from '../components/labs/DiffAttnSimulator';
import RAGUncertaintySimulator from '../components/labs/RAGUncertaintySimulator';

export default function Labs() {
  return (
    <div className="pt-32 pb-24 px-4 max-w-5xl mx-auto min-h-screen relative z-10 font-sans">
      <LabsHeader />
      <CFMSimulator />
      <GRPOSimulator />
      <DiffAttnSimulator />
      <RAGUncertaintySimulator />
    </div>
  );
}
