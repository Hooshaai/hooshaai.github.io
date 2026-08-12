import React, { useState } from 'react';

const JobQueue = ({ onToast = () => {} }) => {
  const [jobs, setJobs] = useState([
    {
      id: 'JOB-9481',
      name: 'LLM Llama-3-70B Fine-Tuning Step 4200',
      owner: 'ml-team',
      priority: 'CRITICAL',
      node: 'node-beta-02',
      status: 'RUNNING',
      progress: 68,
      elapsed: '03:42:15'
    },
    {
      id: 'JOB-9482',
      name: 'Multimodal Vector Index Batch Rebuild',
      owner: 'search-infra',
      priority: 'HIGH',
      node: 'node-beta-01',
      status: 'RUNNING',
      progress: 42,
      elapsed: '01:15:00'
    },
    {
      id: 'JOB-9483',
      name: 'Dataset Tokenization & Sharding (CommonCrawl)',
      owner: 'data-eng',
      priority: 'NORMAL',
      node: 'node-alpha-02',
      status: 'RUNNING',
      progress: 89,
      elapsed: '05:10:45'
    },
    {
      id: 'JOB-9484',
      name: 'Quantization FP16 -> INT8 Model Export',
      owner: 'deploy-bot',
      priority: 'HIGH',
      node: 'node-alpha-01',
      status: 'QUEUED',
      progress: 0,
      elapsed: '00:00:00'
    },
    {
      id: 'JOB-9485',
      name: 'Reinforcement Learning Evaluation Suite',
      owner: 'eval-agent',
      priority: 'NORMAL',
      node: 'UNASSIGNED',
      status: 'QUEUED',
      progress: 0,
      elapsed: '00:00:00'
    },
    {
      id: 'JOB-9479',
      name: 'Synthetic Data Augmentation Generation',
      owner: 'research-lab',
      priority: 'NORMAL',
      node: 'node-gamma-01',
      status: 'COMPLETED',
      progress: 100,
      elapsed: '02:05:30'
    },
    {
      id: 'JOB-9475',
      name: 'Distributed Attention Profiling Run',
      owner: 'perf-bench',
      priority: 'HIGH',
      node: 'node-alpha-02',
      status: 'FAILED',
      progress: 35,
      elapsed: '00:12:10'
    }
  ]);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter((j) => {
    const matchesTab = activeTab === 'ALL' || j.status === activeTab;
    const matchesSearch =
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleJobAction = (jobId, action) => {
    if (action === 'Cancel') {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      onToast(`Job ${jobId} cancelled.`);
    } else if (action === 'Retry') {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: 'RUNNING', progress: 5, elapsed: '00:00:05' } : j
        )
      );
      onToast(`Job ${jobId} restarted execution.`);
    } else if (action === 'Prioritize') {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, priority: 'CRITICAL' } : j))
      );
      onToast(`Job ${jobId} priority escalated to CRITICAL.`);
    }
  };

  const handleSubmitJob = () => {
    const newId = `JOB-${Math.floor(9000 + Math.random() * 1000)}`;
    const newJob = {
      id: newId,
      name: 'Automated Benchmark Pipeline Run',
      owner: 'root-op',
      priority: 'HIGH',
      node: 'node-alpha-01',
      status: 'QUEUED',
      progress: 0,
      elapsed: '00:00:00'
    };
    setJobs((prev) => [newJob, ...prev]);
    onToast(`Submitted new job: ${newId}`);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/20">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
            Scheduler // Workload Manager
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-tasks text-gray-300 text-2xl"></i> Job Queue
          </h1>
        </div>
        <button
          onClick={handleSubmitJob}
          className="px-4 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-md flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Submit Workload
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Active Jobs</div>
          <div className="text-2xl font-bold text-white mt-1">
            {jobs.filter((j) => j.status === 'RUNNING').length}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Queued</div>
          <div className="text-2xl font-bold text-white mt-1">
            {jobs.filter((j) => j.status === 'QUEUED').length}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Completed (24h)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {jobs.filter((j) => j.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Failed</div>
          <div className="text-2xl font-bold text-white mt-1">
            {jobs.filter((j) => j.status === 'FAILED').length}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/[0.03] border border-white/20 rounded-2xl p-6 shadow-md">
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['ALL', 'RUNNING', 'QUEUED', 'COMPLETED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveTab(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === st
                    ? 'bg-white text-black shadow-md'
                    : 'bg-black text-gray-400 border border-white/20 hover:text-white hover:border-white/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              id="admin-job-search"
              name="jobSearch"
              aria-label="Filter jobs by ID, name or owner"
              type="text"
              placeholder="Search job ID, task name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-white focus:outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto bg-black rounded-xl border border-white/20">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="text-gray-400 border-b border-white/20 text-[10px] uppercase tracking-widest bg-white/5 font-bold">
              <tr>
                <th className="py-4 pl-6">Job Identifier</th>
                <th className="py-4">Workload Name</th>
                <th className="py-4">Priority</th>
                <th className="py-4">Node</th>
                <th className="py-4">Status</th>
                <th className="py-4">Progress</th>
                <th className="py-4">Elapsed</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white tracking-wider">{job.id}</td>
                    <td className="py-4 max-w-xs truncate text-gray-300">
                      <div>{job.name}</div>
                      <div className="text-[9px] text-gray-400 uppercase">Owner: {job.owner}</div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                          job.priority === 'CRITICAL'
                            ? 'bg-white text-black border-white'
                            : job.priority === 'HIGH'
                            ? 'bg-white/10 text-white border-white/30'
                            : 'bg-black text-gray-400 border-white/20'
                        }`}
                      >
                        {job.priority}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300 font-bold">{job.node}</td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                          job.status === 'RUNNING'
                            ? 'bg-white text-black border-white'
                            : job.status === 'QUEUED'
                            ? 'bg-black text-gray-300 border-white/20'
                            : job.status === 'COMPLETED'
                            ? 'bg-white/10 text-white border-white/30'
                            : 'bg-black text-gray-500 border-white/10'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-black h-1.5 rounded-full overflow-hidden border border-white/20">
                          <div
                            className="bg-white h-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-gray-300 w-8 text-right font-bold">
                          {job.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400">{job.elapsed}</td>
                    <td className="py-4 text-right pr-6">
                      {job.status === 'RUNNING' && (
                        <>
                          <button
                            onClick={() => handleJobAction(job.id, 'Prioritize')}
                            title="Escalate Priority"
                            className="text-gray-400 hover:text-white mr-2 p-1.5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded transition-colors"
                          >
                            <i className="fas fa-arrow-up text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleJobAction(job.id, 'Cancel')}
                            title="Terminate Job"
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded transition-colors"
                          >
                            <i className="fas fa-stop text-xs"></i>
                          </button>
                        </>
                      )}
                      {job.status === 'QUEUED' && (
                        <button
                          onClick={() => handleJobAction(job.id, 'Cancel')}
                          title="Remove from Queue"
                          className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded transition-colors"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      )}
                      {(job.status === 'FAILED' || job.status === 'COMPLETED') && (
                        <button
                          onClick={() => handleJobAction(job.id, 'Retry')}
                          title="Re-run Job"
                          className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded transition-colors"
                        >
                          <i className="fas fa-redo text-xs"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No jobs matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobQueue;
