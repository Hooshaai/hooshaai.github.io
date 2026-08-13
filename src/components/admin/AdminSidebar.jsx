import React, { useState } from 'react';
import { LayoutDashboard, Server, ListTodo, Terminal, ShieldCheck, LogOut, Menu, X, Radio, Activity } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Cluster Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'nodes', label: 'Node Management', icon: Server, badge: '6 Active' },
    { id: 'jobs', label: 'Job Queue', icon: ListTodo, badge: '7 Running' },
    { id: 'logs', label: 'System Logs', icon: Terminal, badge: 'Stream' },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between bg-zinc-950/90 backdrop-blur-xl border border-cyan-500/20 p-4 rounded-2xl mb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 text-black rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            H
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wider">HOOSHA ADMIN</div>
            <div className="text-[10px] text-cyan-400 uppercase">System Terminal</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden md:flex'
        } w-full md:w-64 bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 hover:border-cyan-500/30 rounded-3xl flex flex-col justify-between p-6 shrink-0 font-mono shadow-2xl transition-all`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center justify-between pb-6 mb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 text-black rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                H
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wider">HOOSHA</div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">Admin Terminal</div>
              </div>
            </div>
            <span className="relative flex h-2.5 w-2.5" title="System Online">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-3 mb-2">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const IconComponent = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                        isActive
                          ? 'bg-black text-cyan-300 font-bold'
                          : 'bg-zinc-900 text-cyan-400 border border-zinc-800 font-bold'
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

        {/* Footer System Status & Profile */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-4">
          {/* Uptime & Latency Card */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 p-3.5 rounded-2xl text-[11px] space-y-2">
            <div className="flex justify-between items-center text-zinc-400 font-semibold">
              <span>Cluster Uptime</span>
              <span className="text-cyan-400 font-bold">99.98%</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full w-[99.98%] shadow-[0_0_8px_rgba(0,240,255,0.4)]"></div>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> Latency
              </span>
              <span className="text-cyan-200 font-mono font-bold">1.2ms</span>
            </div>
          </div>

          {/* Operator Profile */}
          <div className="flex items-center justify-between bg-zinc-900/70 border border-zinc-800/80 p-3 rounded-2xl">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] text-white font-bold truncate">{user || 'root'}</div>
                <div className="text-[9px] text-cyan-400 uppercase tracking-widest font-semibold">Operator</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Terminate Session"
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
