import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Substack RSS Synced',
      desc: '20 research papers indexed and typeset with KaTeX formulas.',
      time: 'Just now',
      tag: 'Research',
      read: false
    },
    {
      id: 2,
      title: 'Model Checkpoint Release',
      desc: 'Hoosha-CFM-7B weights available in Safetensors format.',
      time: '2h ago',
      tag: 'Vault',
      read: false
    }
  ]);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        console.warn('Audio synth warning:', e);
      }
    }
  };

  const openSpotlight = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/research', label: 'Research', icon: 'fa-newspaper' },
    { path: '/ecosystem', label: 'Ecosystem', icon: 'fa-network-wired' },
    { path: '/models', label: 'Models', icon: 'fa-cube' },
    { path: '/labs', label: 'Labs', icon: 'fa-flask' },
    { path: '/platform', label: 'Platform', icon: 'fa-terminal' },
    { path: '/admin', label: 'Admin', icon: 'fa-shield-alt', danger: true },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/90 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-3' 
        : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4">
        
        {/* Brand Header Logo */}
        <Link 
          to="/" 
          aria-label="Hoosha AI Home Page"
          className="flex items-center gap-3.5 group no-underline text-left rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <i className="fas fa-brain text-cyan-400 text-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true"></i>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
              Hoosha AI
            </span>
            <span className="text-[10px] font-mono text-cyan-400/90 tracking-widest uppercase -mt-0.5 font-medium">
              Research Laboratory
            </span>
          </div>
        </Link>

        {/* Desktop Links Navigation with LayoutId Sliding Pill */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-full border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative">
          {navItems.map((item) => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-xs font-mono transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none z-10 ${
                    isActive
                      ? item.danger
                        ? 'text-red-300 font-bold'
                        : 'text-cyan-300 font-bold'
                      : item.danger
                      ? 'text-red-400/70 hover:text-red-400'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`absolute inset-0 rounded-full border ${
                      item.danger
                        ? 'bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'bg-cyan-500/20 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    }`}
                  />
                )}
                <i className={`fas ${item.icon} text-xs relative z-10`} aria-hidden="true"></i>
                <span className="tracking-wide relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-3">
          
          {/* Cluster Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-mono text-slate-300 shadow-inner" role="status">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" aria-hidden="true"></span>
            <span className="text-slate-200">Cluster Online</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Disable audio synth effects' : 'Enable audio synth effects'}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              soundEnabled
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Web Audio Synth Effects"
          >
            {soundEnabled ? (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-purple-400 animate-pulse"></span>
                <span className="w-0.5 h-2/3 bg-purple-400 animate-pulse delay-75"></span>
                <span className="w-0.5 h-4/5 bg-purple-400 animate-pulse delay-150"></span>
              </span>
            ) : (
              <i className="fas fa-volume-mute" aria-hidden="true"></i>
            )}
            <span className="hidden md:inline">{soundEnabled ? 'Synth On' : 'Mute'}</span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle system notifications feed"
              aria-expanded={showNotifications}
              aria-controls="notifications-dropdown"
              className="w-9 h-9 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none hover:border-cyan-500/40"
              title="Notifications"
            >
              <i className="fas fa-bell text-xs" aria-hidden="true"></i>
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" aria-hidden="true"></span>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" aria-hidden="true"></span>
                </>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  id="notifications-dropdown"
                  role="region"
                  aria-label="System Notifications Feed"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 sm:w-88 bg-slate-950/95 border border-slate-800 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 text-left"
                >
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Grotesk'] font-bold text-sm text-white">System Feed</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl border transition-all text-xs ${
                          n.read 
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' 
                            : 'bg-slate-900/90 border-cyan-500/30 text-slate-200 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className={n.read ? 'text-slate-300' : 'text-cyan-300'}>{n.title}</span>
                          <span className="text-[9px] font-mono text-slate-500">{n.time}</span>
                        </div>
                        <div className="text-slate-400 leading-relaxed font-sans text-[11px]">{n.desc}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ⌘K Spotlight Trigger Button */}
          <button
            onClick={openSpotlight}
            aria-label="Open search spotlight (Cmd+K)"
            className="hidden sm:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all shadow-inner focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            title="Search Everything (Cmd+K)"
          >
            <i className="fas fa-search text-cyan-400 text-[11px]" aria-hidden="true"></i>
            <span>Search</span>
            <kbd className="bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu-drawer"
            className="lg:hidden w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            <i className={`fas ${isOpen ? 'fa-times text-cyan-400' : 'fa-bars'}`} aria-hidden="true"></i>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-slate-950/98 border-b border-slate-800 backdrop-blur-2xl overflow-hidden mt-3 shadow-2xl"
          >
            <nav aria-label="Mobile Navigation" className="px-6 py-6 space-y-3 text-left">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 p-3.5 rounded-xl text-sm font-mono transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                      isActive
                        ? item.danger
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : item.danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <i className={`fas ${item.icon} text-base w-5 text-cyan-400`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => { setIsOpen(false); openSpotlight(); }}
                  className="flex-1 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none hover:border-cyan-500/40"
                >
                  <i className="fas fa-search" aria-hidden="true"></i> Search Everything (⌘K)
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

