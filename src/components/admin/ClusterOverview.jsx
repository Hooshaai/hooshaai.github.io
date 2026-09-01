import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Users, FileText, Key, Server, Download, Search, Plus, Check, Copy, Ban, X } from 'lucide-react';

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
  const [subscribersList] = useState([
    { e: 'alex.v@deepmind.com', org: 'DeepMind Labs', d: 'Wed, 12 Aug 2026 04:12:00 GMT', s: 'Active' },
    { e: 'sarah.k@openai.com', org: 'OpenAI Safety', d: 'Tue, 11 Aug 2026 18:30:00 GMT', s: 'Active' },
    { e: 'm.chen@stanford.edu', org: 'Stanford HAI', d: 'Mon, 10 Aug 2026 12:15:00 GMT', s: 'Active' },
    { e: 'dev@anthropic.com', org: 'Anthropic Research', d: 'Sun, 09 Aug 2026 09:45:00 GMT', s: 'Active' },
    { e: 'infra-admin@meta.com', org: 'Meta AI Infra', d: 'Sat, 08 Aug 2026 21:00:00 GMT', s: 'Inactive' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    { title: 'Total Subscribers', val: effectiveSubs.length.toLocaleString(), change: '+12.4%', icon: Users },
    { title: 'Published Articles', val: '24', change: '+4', icon: FileText },
    { title: 'Active API Keys', val: activeApiKeys.filter(k => k.status === 'Active').length, change: '+2', icon: Key },
    { title: 'Cluster Health', val: '99.98%', change: 'Optimal', icon: Server }
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">
            System Control // Telemetry Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <PieChart className="w-7 h-7 text-cyan-400" /> Cluster Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping"></span>
            CLUSTER ONLINE (H100-SIGMA)
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComp = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 hover:border-cyan-500/30 transition-all rounded-2xl p-5 shadow-xl space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  {stat.title}
                </span>
                <IconComp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
                {stat.val}
              </div>
              <div className="flex items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span className="bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded mr-2">
                  {stat.change}
                </span>
                vs prev period
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Chart & API Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscriber Growth Chart */}
        <div className="lg:col-span-2 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 hover:border-cyan-500/30 transition-all rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                Subscriber Growth
              </h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Year to Date Progression</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></span>
              <span className="text-cyan-200 font-bold">Total Subs</span>
            </div>
          </div>

          <div className="h-[280px] w-full bg-black/90 rounded-2xl p-3 border border-zinc-800/90 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanSubscriberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
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
                    border: '1px solid rgba(0,240,255,0.4)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area
                  type="monotone"
                  dataKey="subs"
                  stroke="#00f0ff"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanSubscriberGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 hover:border-cyan-500/30 transition-all rounded-3xl p-6 flex flex-col shadow-xl">
          <div className="mb-6 flex justify-between items-start border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> API Keys
              </h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Active Access Tokens</p>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs transition-colors shadow-md"
              title="Issue Key"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
            {activeApiKeys.map((k) => (
              <div key={k.key} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">{k.name}</span>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      k.status === 'Active'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/90 p-2 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="truncate max-w-[140px] text-cyan-200">{k.key}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyKey(k.key)}
                      className="hover:text-cyan-300 transition-colors p-1 text-zinc-400"
                      title="Copy Key"
                    >
                      {copiedKey === k.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {k.status === 'Active' && (
                      <button
                        onClick={() => handleRevokeKey(k.key)}
                        className="hover:text-rose-400 transition-colors p-1 text-zinc-500"
                        title="Revoke Key"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest uppercase text-xs py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Issue New Token
          </button>
        </div>
      </div>

      {/* Subscribers Directory Table */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 hover:border-cyan-500/30 transition-all rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Subscribers Directory
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Manage Registered Users</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
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
                className="w-full bg-black/90 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="text-xs font-bold tracking-wider uppercase bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-black/90 rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="text-zinc-400 border-b border-zinc-800 text-[10px] uppercase tracking-widest bg-zinc-900/80 font-bold">
              <tr>
                <th className="py-4 pl-6">Email Address</th>
                <th className="py-4">Organization</th>
                <th className="py-4">Subscribed Date</th>
                <th className="py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {paginatedSubs.length > 0 ? (
                paginatedSubs.map((sub, i) => (
                  <tr key={i} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3.5 pl-6 text-white font-medium">{sub.e}</td>
                    <td className="py-3.5 text-zinc-400">{sub.org}</td>
                    <td className="py-3.5 text-zinc-400">{sub.d}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${
                          sub.s === 'Active'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {sub.s}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-zinc-500">
                    No subscribers found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400 pt-2">
          <div>
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredSubs.length} entries)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-white rounded-xl transition-colors font-bold"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-white rounded-xl transition-colors font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Issue Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Issue New API Token
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
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
                  className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
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
                  className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
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
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)]"
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
