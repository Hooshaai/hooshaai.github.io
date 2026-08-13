import React, { useState, useEffect } from 'react';
import { ListTodo, Play, Plus, Download, Search, ArrowUp, StopCircle, RotateCcw, Trash2, Clock, Cpu, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

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
      elapsedSec: 13335,
      framework: 'PyTorch / Megatron-LM'
    },
    {
      id: 'JOB-9482',
      name: 'Multimodal Vector Index Batch Rebuild',
      owner: 'search-infra',
      priority: 'HIGH',
      node: 'node-beta-01',
      status: 'RUNNING',
      progress: 42,
      elapsedSec: 4500,
      framework: 'FAISS / CUDA'
    },
    {
      id: 'JOB-9483',
      name: 'Dataset Tokenization & Sharding (CommonCrawl)',
      owner: 'data-eng',
      priority: 'NORMAL',
      node: 'node-alpha-02',
      status: 'RUNNING',
      progress: 89,
      elapsedSec: 18645,
      framework: 'HuggingFace Tokenizers'
    },
    {
      id: 'JOB-9484',
      name: 'Quantization FP16 -> INT8 Model Export',
      owner: 'deploy-bot',
      priority: 'HIGH',
      node: 'node-alpha-01',
      status: 'QUEUED',
      progress: 0,
      elapsedSec: 0,
      framework: 'TensorRT-LLM'
    },
    {
      id: 'JOB-9485',
      name: 'Reinforcement Learning Evaluation Suite',
      owner: 'eval-agent',
      priority: 'NORMAL',
      node: 'UNASSIGNED',
      status: 'QUEUED',
      progress: 0,
      elapsedSec: 0,
      framework: 'vLLM / Ray'
    },
    {
      id: 'JOB-9479',
      name: 'Synthetic Data Augmentation Generation',
      owner: 'research-lab',
      priority: 'NORMAL',
      node: 'node-gamma-01',
      status: 'COMPLETED',
      progress: 100,
      elapsedSec: 7530,
      framework: 'DeepSpeed'
    },
    {
      id: 'JOB-9475',
      name: 'Distributed Attention Profiling Run',
      owner: 'perf-bench',
      priority: 'HIGH',
      node: 'node-alpha-02',
      status: 'FAILED',
      progress: 35,
      elapsedSec: 730,
      framework: 'Triton JIT'
    }
  ]);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(true);

  // Submit Workload Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newJobName, setNewJobName] = useState('');
  const [newJobOwner, setNewJobOwner] = useState('ml-infra');
  const [newJobPriority, setNewJobPriority] = useState('HIGH');
  const [newJobNode, setNewJobNode] = useState('node-alpha-01');
  const [newJobFramework, setNewJobFramework] = useState('PyTorch');

  // Job details modal
  const [selectedJob, setSelectedJob] = useState(null);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setJobs((prevJobs) => {
        let hasCompletedJob = false;
        const updated = prevJobs.map((job) => {
          if (job.status === 'RUNNING') {
            const nextProgress = Math.min(100, job.progress + Math.floor(Math.random() * 3) + 1);
            const isFinished = nextProgress === 100;
            if (isFinished) hasCompletedJob = true;

            return {
              ...job,
              progress: nextProgress,
              elapsedSec: job.elapsedSec + 1,
              status: isFinished ? 'COMPLETED' : 'RUNNING'
            };
          }
          return job;
        });

        if (hasCompletedJob) {
          const queuedIdx = updated.findIndex((j) => j.status === 'QUEUED');
          if (queuedIdx !== -1) {
            updated[queuedIdx] = {
              ...updated[queuedIdx],
              status: 'RUNNING',
              progress: 2,
              node: 'node-alpha-01',
              elapsedSec: 1
            };
            onToast(`Job ${updated[queuedIdx].id} promoted from QUEUED to RUNNING.`);
          }
        }

        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLive, onToast]);

  const filteredJobs = jobs.filter((j) => {
    const matchesTab = activeTab === 'ALL' || j.status === activeTab;
    const matchesSearch =
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.node.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleJobAction = (jobId, action) => {
    if (action === 'Cancel') {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      onToast(`Job ${jobId} cancelled.`);
    } else if (action === 'Retry') {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: 'RUNNING', progress: 5, elapsedSec: 0, node: 'node-alpha-01' }
            : j
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

  const handleSubmitJob = (e) => {
    e.preventDefault();
    if (!newJobName.trim()) return;

    const newId = `JOB-${Math.floor(9500 + Math.random() * 500)}`;
    const newJob = {
      id: newId,
      name: newJobName,
      owner: newJobOwner,
      priority: newJobPriority,
      node: newJobNode,
      status: 'QUEUED',
      progress: 0,
      elapsedSec: 0,
      framework: newJobFramework
    };
    setJobs((prev) => [newJob, ...prev]);
    setShowSubmitModal(false);
    setNewJobName('');
    onToast(`Submitted workload: ${newId}`);
  };

  const exportJobsCSV = () => {
    if (filteredJobs.length === 0) return;
    const headers = ['Job Identifier', 'Workload Name', 'Owner', 'Priority', 'Node', 'Status', 'Progress', 'Elapsed Time', 'Framework'];
    const rows = filteredJobs.map(j => [
      `"${j.id}"`,
      `"${j.name}"`,
      `"${j.owner}"`,
      `"${j.priority}"`,
      `"${j.node}"`,
      `"${j.status}"`,
      `"${j.progress}%"`,
      `"${formatTime(j.elapsedSec)}"`,
      `"${j.framework}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job_queue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">
            Scheduler // Workload Orchestration
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <ListTodo className="w-7 h-7 text-cyan-400" /> Job Queue
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
              isLive
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-ping' : 'bg-zinc-600'}`}></span>
            {isLive ? 'Live Stream' : 'Paused'}
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Submit Workload
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Active Jobs</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {jobs.filter((j) => j.status === 'RUNNING').length}
          </div>
        </div>
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Queued</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {jobs.filter((j) => j.status === 'QUEUED').length}
          </div>
        </div>
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Completed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {jobs.filter((j) => j.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Failed</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {jobs.filter((j) => j.status === 'FAILED').length}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 hover:border-cyan-500/30 transition-all rounded-3xl p-6 shadow-xl space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['ALL', 'RUNNING', 'QUEUED', 'COMPLETED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveTab(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === st
                    ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="admin-job-search"
                name="jobSearch"
                aria-label="Filter jobs by ID, name or owner"
                type="text"
                placeholder="Search job ID, task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/90 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <button
              onClick={exportJobsCSV}
              className="text-xs font-bold tracking-wider uppercase bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Export CSV
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto bg-black/90 rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="text-zinc-400 border-b border-zinc-800 text-[10px] uppercase tracking-widest bg-zinc-900/80 font-bold">
              <tr>
                <th className="py-4 pl-6">Job ID</th>
                <th className="py-4">Workload Name</th>
                <th className="py-4">Priority</th>
                <th className="py-4">Node</th>
                <th className="py-4">Status</th>
                <th className="py-4">Progress</th>
                <th className="py-4">Elapsed</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-zinc-900/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="py-4 pl-6 font-bold text-white tracking-wider">{job.id}</td>
                    <td className="py-4 max-w-xs truncate text-zinc-200">
                      <div className="font-semibold truncate text-white">{job.name}</div>
                      <div className="text-[9px] text-zinc-400 uppercase">{job.framework} • Owner: {job.owner}</div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded border ${
                          job.priority === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                            : job.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {job.priority}
                      </span>
                    </td>
                    <td className="py-4 text-cyan-200 font-bold">{job.node}</td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded border ${
                          job.status === 'RUNNING'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                            : job.status === 'QUEUED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : job.status === 'COMPLETED'
                            ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              job.status === 'FAILED'
                                ? 'bg-rose-500'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-cyan-300 w-8 text-right font-bold">
                          {job.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-400">{formatTime(job.elapsedSec)}</td>
                    <td className="py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      {job.status === 'RUNNING' && (
                        <>
                          <button
                            onClick={() => handleJobAction(job.id, 'Prioritize')}
                            title="Escalate Priority"
                            className="text-zinc-400 hover:text-cyan-300 mr-2 p-1.5 hover:bg-zinc-800 rounded transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleJobAction(job.id, 'Cancel')}
                            title="Terminate Job"
                            className="text-zinc-400 hover:text-rose-400 p-1.5 hover:bg-zinc-800 rounded transition-colors"
                          >
                            <StopCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {job.status === 'QUEUED' && (
                        <button
                          onClick={() => handleJobAction(job.id, 'Cancel')}
                          title="Remove from Queue"
                          className="text-zinc-400 hover:text-rose-400 p-1.5 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(job.status === 'FAILED' || job.status === 'COMPLETED') && (
                        <button
                          onClick={() => handleJobAction(job.id, 'Retry')}
                          title="Re-run Job"
                          className="text-zinc-400 hover:text-cyan-300 p-1.5 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-zinc-500">
                    No jobs matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Workload Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-cyan-400" /> Submit New Compute Workload
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                  Workload Name / Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Attention Profiling Step 100"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                    Owner Team
                  </label>
                  <input
                    type="text"
                    value={newJobOwner}
                    onChange={(e) => setNewJobOwner(e.target.value)}
                    className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                    Job Priority
                  </label>
                  <select
                    value={newJobPriority}
                    onChange={(e) => setNewJobPriority(e.target.value)}
                    className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="NORMAL">NORMAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                    Target Compute Node
                  </label>
                  <select
                    value={newJobNode}
                    onChange={(e) => setNewJobNode(e.target.value)}
                    className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="node-alpha-01">node-alpha-01 (H100)</option>
                    <option value="node-beta-01">node-beta-01 (H100)</option>
                    <option value="node-beta-02">node-beta-02 (H100)</option>
                    <option value="UNASSIGNED">Auto-Assign Next Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                    Framework / Stack
                  </label>
                  <input
                    type="text"
                    value={newJobFramework}
                    onChange={(e) => setNewJobFramework(e.target.value)}
                    placeholder="e.g. PyTorch / DeepSpeed"
                    className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  Queue Workload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspector Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative font-mono">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-cyan-400" />
                  {selectedJob.id}: {selectedJob.name}
                </h3>
                <p className="text-xs text-zinc-400">Framework: {selectedJob.framework}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold text-cyan-300">{selectedJob.status} ({selectedJob.progress}%)</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Priority</span>
                <span className="font-bold text-white">{selectedJob.priority}</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Assigned Node</span>
                <span className="font-bold text-white">{selectedJob.node}</span>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Elapsed Time</span>
                <span className="font-bold text-white">{formatTime(selectedJob.elapsedSec)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobQueue;
