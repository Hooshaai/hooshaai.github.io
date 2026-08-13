import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import ClusterOverview from '../components/admin/ClusterOverview';
import NodeManagement from '../components/admin/NodeManagement';
import JobQueue from '../components/admin/JobQueue';
import SystemLogs from '../components/admin/SystemLogs';
import { ShieldCheck, Lock, User, CheckCircle2 } from 'lucide-react';

const Admin = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const [activeTab, setActiveTab] = useState('overview');
  const [copiedKey, setCopiedKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    apiFetch('/api/v1/subscribe/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => {
        if (data.results) {
          const apiSubs = data.results.map(sub => ({
            e: sub.email,
            org: 'External',
            d: new Date(sub.subscribed_at).toUTCString(),
            s: sub.is_active ? 'Active' : 'Inactive'
          }));
          setSubscribers(apiSubs);
        }
      })
      .catch(err => {
        console.warn('Falling back to local storage subs', err);
        const saved = JSON.parse(localStorage.getItem('hoosha_subscribers') || '[]');
        setSubscribers(saved);
      });
  }, [auth]);

  const chartData = [
    { name: 'Jan', subs: 4000 },
    { name: 'Feb', subs: 5500 },
    { name: 'Mar', subs: 8200 },
    { name: 'Apr', subs: 11000 },
    { name: 'May', subs: 12500 },
    { name: 'Jun', subs: 14293 }
  ];

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        setAuth(true);
      } else {
        triggerToast('Invalid credentials');
      }
    } catch (err) {
      console.error('Login failed, using fallback mock auth', err);
      if ((user === 'admin' || user === 'root') && (pass === 'admin12345' || pass === 'root')) {
        setAuth(true);
      } else {
        triggerToast('Invalid credentials (Try: root / root or admin / admin12345)');
      }
    }
  };

  const triggerToast = msg => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 2500);
  };

  const copyKey = key => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    triggerToast(`Copied ${key.substring(0, 12)}... to clipboard`);
    setTimeout(() => {
      setCopiedKey('');
    }, 2000);
  };

  // Ultra-premium glassmorphism login view
  if (!auth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-24 pb-12 relative z-10 font-mono overflow-hidden">
        {/* Ambient background glows */}
        <div className="fixed top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
        <div className="fixed bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="bg-zinc-950/80 backdrop-blur-xl border border-cyan-500/20 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,240,255,0.12)] relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              System Admin Terminal
            </h2>
            <p className="text-xs text-cyan-400 uppercase tracking-widest mt-1 font-semibold">
              Restricted Cluster Root Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-operator-id"
                className="block text-[10px] text-zinc-400 mb-2 uppercase tracking-widest font-bold flex items-center gap-1.5"
              >
                <User className="w-3 h-3 text-cyan-400" /> Operator ID
              </label>
              <input
                id="admin-operator-id"
                name="username"
                aria-label="Operator ID"
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                autoComplete="username"
                placeholder="root"
                className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-700 focus:border-cyan-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="admin-access-code"
                className="block text-[10px] text-zinc-400 mb-2 uppercase tracking-widest font-bold flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-cyan-400" /> Access Code
              </label>
              <input
                id="admin-access-code"
                name="password"
                aria-label="Access Code"
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full bg-black/90 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-700 focus:border-cyan-500 focus:outline-none transition-all tracking-widest font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest uppercase text-xs py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] mt-4"
            >
              Initialize Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative z-10 font-mono">
      {/* Background ambient lighting */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={() => setAuth(false)}
      />

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0">
        {activeTab === 'overview' && (
          <ClusterOverview
            subscribers={subscribers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            chartData={chartData}
            copyKey={copyKey}
            copiedKey={copiedKey}
          />
        )}

        {activeTab === 'nodes' && (
          <NodeManagement onToast={triggerToast} />
        )}

        {activeTab === 'jobs' && (
          <JobQueue onToast={triggerToast} />
        )}

        {activeTab === 'logs' && (
          <SystemLogs onToast={triggerToast} />
        )}
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 px-5 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.3)] flex items-center gap-3 z-50 animate-fadeIn font-mono text-xs tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span className="uppercase font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default Admin;
