import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClusterOverview = ({
  subscribers = [],
  searchQuery = '',
  setSearchQuery = () => {},
  chartData = [],
  copyKey = () => {},
  copiedKey = ''
}) => {
  const [activeApiKeys, setActiveApiKeys] = useState([
    { name: 'Production Scraper', key: 'sk-live-prod-9842a1b9', status: 'Active', scope: 'Full Access', created: '2026-01-15' },
    { name: 'Staging Environment', key: 'sk-test-stage-41208f4e', status: 'Active', scope: 'Read Only', created: '2026-02-01' },
    { name: 'Legacy Researcher', key: 'sk-live-legacy-7711c3d2', status: 'Revoked', scope: 'Inference Only', created: '2025-11-10' }
  ]);

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Full Access');

  // Subscriber table state & pagination
  const [subscribersList, setSubscribersList] = useState([
    { e: 'alex.v@deepmind.com', org: 'DeepMind Labs', d: 'Wed, 12 Aug 2026 04:12:00 GMT', s: 'Active' },
    { e: 'sarah.k@openai.com', org: 'OpenAI Safety', d: 'Tue, 11 Aug 2026 18:30:00 GMT', s: 'Active' },
    { e: 'm.chen@stanford.edu', org: 'Stanford HAI', d: 'Mon, 10 Aug 2026 12:15:00 GMT', s: 'Active' },
    { e: 'dev@anthropic.com', org: 'Anthropic Research', d: 'Sun, 09 Aug 2026 09:45:00 GMT', s: 'Active' },
    { e: 'infra-admin@meta.com', org: 'Meta AI Infra', d: 'Sat, 08 Aug 2026 21:00:00 GMT', s: 'Inactive' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const effectiveSubs = subscribers.length > 0 ? subscribers : subscribersList;

  const filteredSubs = effectiveSubs.filter(
    s =>
      s.e.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.org.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubs.length / itemsPerPage) || 1;
  const paginatedSubs = filteredSubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CSV Export implementation
  const handleExportCSV = () => {
    if (filteredSubs.length === 0) return;
    const headers = ['Email Address', 'Organization', 'Subscribed Date', 'Status'];
    const rows = filteredSubs.map(s => [
      `"${s.e}"`,
      `"${s.org}"`,
      `"${s.d}"`,
      `"${s.s}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleIssueKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const generatedKey = `sk-live-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;
    const newEntry = {
      name: newKeyName,
      key: generatedKey,
      status: 'Active',
      scope: newKeyScope,
      created: new Date().toISOString().split('T')[0]
    };
    setActiveApiKeys([newEntry, ...activeApiKeys]);
    setNewKeyName('');
    setShowKeyModal(false);
  };

  const handleRevokeKey = (keyString) => {
    setActiveApiKeys(prev =>
      prev.map(k => (k.key === keyString ? { ...k, status: 'Revoked' } : k))
    );
  };

  const stats = [
    { title: 'Total Subscribers', val: effectiveSubs.length.toLocaleString(), change: '+12.4%', icon: 'fa-users' },
    { title: 'Published Articles', val: '24', change: '+4', icon: 'fa-file-alt' },
    { title: 'Active API Keys', val: activeApiKeys.filter(k => k.status === 'Active').length, change: '+2', icon: 'fa-key' },
    { title: 'System Status', val: '99.98%', change: 'Optimal', icon: 'fa-server' }
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
            System Control // Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-chart-pie text-zinc-300 text-xl"></i> Cluster Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            CLUSTER ONLINE (H100-SIGMA)
          </span>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                {stat.title}
              </span>
              <i className={`fas ${stat.icon} text-zinc-400 text-sm`}></i>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight mb-2">
              {stat.val}
            </div>
            <div className="flex items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-white mr-2">
                {stat.change}
              </span>
              vs prev month
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & API Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscriber Growth Chart */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                <i className="fas fa-chart-area text-zinc-300 text-base"></i> Subscriber Growth
              </h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Year to Date Progression</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
              <span className="text-zinc-300 font-bold">Total Subs</span>
            </div>
          </div>

          <div className="h-[280px] w-full bg-black rounded-xl p-3 border border-zinc-800 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="monoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Area
                  type="monotone"
                  dataKey="subs"
                  stroke="#ffffff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#monoGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Management */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-xl">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                <i className="fas fa-key text-zinc-300 text-base"></i> API Keys
              </h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Access Tokens</p>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs transition-colors"
              title="Issue Key"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
            {activeApiKeys.map((k) => (
              <div key={k.key} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">{k.name}</span>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      k.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black p-2 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="truncate max-w-[150px]">{k.key}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyKey(k.key)}
                      className="hover:text-white transition-colors p-1 text-zinc-400"
                      title="Copy Key"
                    >
                      {copiedKey === k.key ? <i className="fas fa-check text-emerald-400"></i> : <i className="fas fa-copy"></i>}
                    </button>
                    {k.status === 'Active' && (
                      <button
                        onClick={() => handleRevokeKey(k.key)}
                        className="hover:text-rose-400 transition-colors p-1 text-zinc-500"
                        title="Revoke Key"
                      >
                        <i className="fas fa-ban text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="w-full mt-6 bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus text-xs"></i> Issue New Key
          </button>
        </div>
      </div>

      {/* Subscribers Directory Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              <i className="fas fa-users text-zinc-300 text-base"></i> Subscribers Directory
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Manage Registered Users</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
              <input
                id="admin-subscriber-search"
                name="subscriberSearch"
                aria-label="Search email or organization"
                type="text"
                placeholder="Search email / org..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="text-xs font-bold tracking-wider uppercase bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors flex items-center gap-2 whitespace-nowrap shadow"
            >
              <i className="fas fa-download text-xs text-zinc-300"></i> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-black rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="text-zinc-400 border-b border-zinc-800 text-[10px] uppercase tracking-widest bg-zinc-900/60 font-bold">
              <tr>
                <th className="py-4 pl-6">Email Address</th>
                <th className="py-4">Organization</th>
                <th className="py-4">Subscribed Date</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {paginatedSubs.length > 0 ? (
                paginatedSubs.map((sub, i) => (
                  <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 pl-6 text-white font-medium">{sub.e}</td>
                    <td className="py-3.5 text-zinc-400">{sub.org}</td>
                    <td className="py-3.5 text-zinc-400">{sub.d}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${
                          sub.s === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {sub.s}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-6">
                      <button className="text-zinc-400 hover:text-white mr-2 p-1.5 hover:bg-zinc-800 rounded transition-colors">
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button className="text-zinc-500 hover:text-rose-400 p-1.5 hover:bg-zinc-800 rounded transition-colors">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-zinc-500">
                    No subscribers found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-xs text-zinc-400 pt-3">
          <div>
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredSubs.length} entries)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Issue Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <i className="fas fa-key text-zinc-300"></i> Issue New API Token
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleIssueKey} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                  Application / Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fine-Tuning Pipeline"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                  Scope Access Level
                </label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-zinc-500 focus:outline-none"
                >
                  <option value="Full Access">Full Access (Read/Write)</option>
                  <option value="Inference Only">Inference Only</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClusterOverview;
