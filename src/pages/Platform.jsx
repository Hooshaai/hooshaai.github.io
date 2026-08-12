import React from 'react';
import DashboardHeader from '../components/platform/DashboardHeader';
import NodeTelemetry from '../components/platform/NodeTelemetry';
import ConvergenceCharts from '../components/platform/ConvergenceCharts';
import CudaPlayground from '../components/platform/CudaPlayground';
import CmsPublisher from '../components/platform/CmsPublisher';

const Platform = () => {
  return (
    <div className="platform-page pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 font-mono text-white">
      <DashboardHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column - Takes 2/3 width on large screens */}
        <div className="xl:col-span-2 space-y-8">
          <NodeTelemetry />
          <ConvergenceCharts />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <CudaPlayground />
          <CmsPublisher />
        </div>
      </div>
    </div>
  );
};

export default Platform;
