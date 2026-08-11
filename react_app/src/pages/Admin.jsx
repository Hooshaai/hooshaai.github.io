import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  
  const [copiedKey, setCopiedKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const subscribers = [
    { e: 'researcher@mit.edu', org: 'MIT', d: '2026-08-11 14:22 UTC', s: 'Active' },
    { e: 'dev@openai.com', org: 'OpenAI', d: '2026-08-10 09:15 UTC', s: 'Active' },
    { e: 'student@stanford.edu', org: 'Stanford', d: '2026-08-09 18:40 UTC', s: 'Pending' },
    { e: 't.majlesi@ut.ac.ir', org: 'Univ of Tehran', d: '2026-08-08 11:10 UTC', s: 'Active' }
  ];

  const filteredSubs = subscribers.filter(s => s.e.toLowerCase().includes(searchQuery.toLowerCase()) || s.org.toLowerCase().includes(searchQuery.toLowerCase()));

  const chartData = [
    { name: 'Jan', subs: 4000 },
    { name: 'Feb', subs: 5500 },
    { name: 'Mar', subs: 8200 },
    { name: 'Apr', subs: 11000 },
    { name: 'May', subs: 12500 },
    { name: 'Jun', subs: 14293 },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin12345') {
      setAuth(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setToastMsg(`Copied ${key.substring(0, 10)}... to clipboard`);
    setTimeout(() => {
      setCopiedKey('');
      setToastMsg('');
    }, 2000);
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <form onSubmit={handleLogin} className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
              <i className="fas fa-shield-alt text-2xl text-red-500"></i>
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">System Administration</h2>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Operator ID</label>
            <input 
              type="text" 
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all"
            />
          </div>
          <div className="mb-8">
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Access Code</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            Initialize Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page pt-32 px-4 max-w-7xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-red-500 flex items-center"><i className="fas fa-terminal mr-3"></i>Admin Control Center</h1>
          <p className="text-gray-400 font-mono text-sm mt-1">Authenticated as root operator.</p>
        </div>
        <button onClick={() => setAuth(false)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 border border-gray-700 transition-colors"><i className="fas fa-sign-out-alt mr-2"></i>Terminate Session</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Subscribers', val: '14,293', color: 'red', icon: 'fa-users' },
          { title: 'Published Articles', val: '20', color: 'cyan', icon: 'fa-file-alt' },
          { title: 'Active API Keys', val: '142', color: 'purple', icon: 'fa-key' },
          { title: 'System Status', val: '99.9% Uptime', color: 'green', icon: 'fa-server' }
        ].map(stat => (
          <div key={stat.title} className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 border-t-4 border-t-${stat.color}-500 shadow-lg`}>
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-400 text-sm font-mono">{stat.title}</div>
              <i className={`fas ${stat.icon} text-${stat.color}-500 opacity-50`}></i>
            </div>
            <div className="text-3xl font-bold">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 font-['Space_Grotesk']">Subscriber Growth (YTD)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12, fontFamily: 'monospace'}} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 12, fontFamily: 'monospace'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="subs" stroke="#ef4444" fillOpacity={1} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 font-['Space_Grotesk']">API Key Management</h2>
          <div className="space-y-4">
            {[
              { name: 'Production Scraper', key: 'sk-live-...a1b9', status: 'Active' },
              { name: 'Staging Environment', key: 'sk-test-...8f4e', status: 'Active' },
              { name: 'Legacy Researcher', key: 'sk-live-...c3d2', status: 'Revoked' }
            ].map(k => (
              <div key={k.name} className="bg-black border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-bold text-gray-300">{k.name}</div>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${k.status === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>{k.status}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-800 text-xs font-mono text-gray-400">
                  <span>{k.key}</span>
                  <button onClick={() => copyKey(k.key)} className="hover:text-cyan-400 transition-colors">
                    {copiedKey === k.key ? <i className="fas fa-check text-green-400"></i> : <i className="fas fa-copy"></i>}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg border border-gray-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>Generate New Key
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold font-['Space_Grotesk']">Recent Subscribers</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Search email or org..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
            <button className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-colors whitespace-nowrap">
              <i className="fas fa-download mr-2"></i>Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="text-gray-500 border-b border-gray-800 uppercase tracking-wider text-xs bg-black/30">
              <tr>
                <th className="py-4 pl-4 rounded-tl-lg">Email Address</th>
                <th className="py-4">Organization</th>
                <th className="py-4">Subscribed Date</th>
                <th className="py-4">Status</th>
                <th className="py-4 rounded-tr-lg text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSubs.map((sub, i) => (
                <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 pl-4 text-cyan-400">{sub.e}</td>
                  <td className="py-4 text-gray-400">{sub.org}</td>
                  <td className="py-4 text-gray-500">{sub.d}</td>
                  <td className="py-4"><span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider ${sub.s === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'}`}>{sub.s}</span></td>
                  <td className="py-4 text-right pr-4">
                    <button className="text-gray-500 hover:text-cyan-400 mr-3 transition-colors"><i className="fas fa-edit"></i></button>
                    <button className="text-gray-500 hover:text-red-400 transition-colors"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-cyan-500/50 text-cyan-400 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce">
          <i className="fas fa-check-circle"></i>
          <span className="font-mono text-sm">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default Admin;
