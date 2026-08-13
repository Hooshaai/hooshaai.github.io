import React from 'react';
import DashboardHeader from '../components/platform/DashboardHeader';
import NodeTelemetry from '../components/platform/NodeTelemetry';
import ConvergenceCharts from '../components/platform/ConvergenceCharts';
import CudaPlayground from '../components/platform/CudaPlayground';
import CmsPublisher from '../components/platform/CmsPublisher';

const Platform = () => {
  return (
    <div className="platform-page min-h-screen bg-black text-white pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 font-mono">
      {/* Background ambient lighting */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <DashboardHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column - Telemetry & Convergence */}
        <div className="xl:col-span-2 space-y-8">
          <NodeTelemetry />
          <ConvergenceCharts />
        </div>

        {/* Right Column - CUDA Workbench & CMS Studio */}
        <div className="space-y-8">
          <CudaPlayground />
          <CmsPublisher />
        </div>
      </div>
    </div>
  );
};

export default Platform;
