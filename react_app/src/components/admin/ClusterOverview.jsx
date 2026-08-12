import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClusterOverview = ({
  subscribers = [],
  searchQuery = '',
  setSearchQuery = () => {},
  chartData = [],
  copyKey = () => {},
  copiedKey = ''
}) => {
  const filteredSubs = subscribers.filter(
    s =>
      s.e.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.org.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: 'Total Subscribers', val: '14,293', change: '+12.4%', icon: 'fa-users' },
    { title: 'Published Articles', val: '20', change: '+4', icon: 'fa-file-alt' },
    { title: 'Active API Keys', val: '142', change: '+8', icon: 'fa-key' },
    { title: 'System Status', val: '99.9%', change: 'Optimal', icon: 'fa-server' }
  ];

  const apiKeys = [
    { name: 'Production Scraper', key: 'sk-live-...a1b9', status: 'Active' },
    { name: 'Staging Environment', key: 'sk-test-...8f4e', status: 'Active' },
    { name: 'Legacy Researcher', key: 'sk-live-...c3d2', status: 'Revoked' }
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
            System Control // Telemetry
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-chart-pie text-zinc-400 text-2xl"></i> Cluster Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-zinc-900 text-zinc-300 border border-zinc-700">
            <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
            CLUSTER ONLINE
          </span>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-zinc-500 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                {stat.title}
              </span>
              <i className={`fas ${stat.icon} text-zinc-500 text-sm`}></i>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight mb-2">
              {stat.val}
            </div>
            <div className="flex items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300 mr-2">
                {stat.change}
              </span>
              vs previous period
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & API Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscriber Growth Chart */}
        <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
                <i className="fas fa-chart-area text-zinc-400 text-base"></i> Subscriber Growth
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Year to Date Progression</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
              <span className="text-zinc-400">Total Subs</span>
            </div>
          </div>

          <div className="h-[280px] w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800/80">
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
                  stroke="#52525b"
                  tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#52525b"
                  tick={{ fontSize: 10, fill: '#a1a1aa', fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
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
        <div className="bg-black border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              <i className="fas fa-key text-zinc-400 text-base"></i> API Keys
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Access Control & Tokens</p>
          </div>

          <div className="space-y-3.5 flex-1">
            {apiKeys.map((k) => (
              <div key={k.name} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">{k.name}</span>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      k.status === 'Active'
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black p-2.5 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  <span className="tracking-wider">{k.key}</span>
                  <button
                    onClick={() => copyKey(k.key)}
                    className="hover:text-white transition-colors p-1"
                    title="Copy API Key"
                  >
                    {copiedKey === k.key ? (
                      <i className="fas fa-check text-white"></i>
                    ) : (
                      <i className="fas fa-copy"></i>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase text-[10px] py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
            <i className="fas fa-plus text-xs"></i> Issue New Key
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-black border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              <i className="fas fa-users text-zinc-400 text-base"></i> Subscribers Directory
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Manage Registered Users</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
              <input
                id="admin-subscriber-search"
                name="subscriberSearch"
                aria-label="Search email or organization"
                type="text"
                placeholder="Search email / org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all font-mono"
              />
            </div>
            <button className="text-[10px] font-bold tracking-widest uppercase bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors flex items-center gap-2 whitespace-nowrap">
              <i className="fas fa-download"></i> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-zinc-950 rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="text-zinc-400 border-b border-zinc-800 text-[10px] uppercase tracking-widest bg-black">
              <tr>
                <th className="py-4 pl-6">Email Address</th>
                <th className="py-4">Organization</th>
                <th className="py-4">Subscribed Date</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredSubs.length > 0 ? (
                filteredSubs.map((sub, i) => (
                  <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 pl-6 text-white font-medium">{sub.e}</td>
                    <td className="py-3.5 text-zinc-400">{sub.org}</td>
                    <td className="py-3.5 text-zinc-500">{sub.d}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${
                          sub.s === 'Active'
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {sub.s}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-6">
                      <button className="text-zinc-400 hover:text-white mr-3 transition-colors p-1.5 hover:bg-zinc-800 rounded">
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button className="text-zinc-400 hover:text-white transition-colors p-1.5 hover:bg-zinc-800 rounded">
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
      </div>
    </div>
  );
};

export default ClusterOverview;
