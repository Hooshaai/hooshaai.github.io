import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const navItems = [
    { id: 'overview', label: 'Cluster Overview', icon: 'fa-chart-pie', badge: 'Live' },
    { id: 'nodes', label: 'Node Management', icon: 'fa-server', badge: '16 Active' },
    { id: 'jobs', label: 'Job Queue', icon: 'fa-tasks', badge: '42 Running' },
    { id: 'logs', label: 'System Logs', icon: 'fa-terminal', badge: 'Stream' },
  ];

  return (
    <aside className="w-full md:w-64 bg-black border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between p-6 shrink-0 font-mono">
      <div>
        {/* Brand / Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm">
              H
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider">HOOSHA</div>
              <div className="text-[10px] text-zinc-500 tracking-widest uppercase">Admin Terminal</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" title="System Online"></span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fas ${item.icon} text-sm ${isActive ? 'text-black' : 'text-zinc-400'}`}></i>
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Session Control */}
      <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
        {/* System Summary Card */}
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-[11px] space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span>Uptime</span>
            <span className="text-white font-bold">99.98%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[99.98%]"></div>
          </div>
          <div className="flex justify-between items-center text-zinc-500 text-[10px]">
            <span>Latency</span>
            <span className="text-zinc-300">1.2ms</span>
          </div>
        </div>

        {/* Operator Profile & Logout */}
        <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
              <i className="fas fa-user-shield text-xs"></i>
            </div>
            <div className="truncate">
              <div className="text-[11px] text-white font-bold truncate">{user || 'root'}</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Operator</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Terminate Session"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
          >
            <i className="fas fa-sign-out-alt text-xs"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
