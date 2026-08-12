import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-2xl border-b border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.9)] py-3' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4">
        
        {/* Brand Header */}
        <Link 
          to="/" 
          aria-label="Hoosha AI Home Page"
          className="flex items-center gap-3.5 group no-underline text-left rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all">
            <div className="w-full h-full bg-gray-950 rounded-[15px] flex items-center justify-center">
              <i className="fas fa-brain text-cyan-400 text-lg group-hover:scale-110 transition-transform" aria-hidden="true"></i>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">Hoosha AI</span>
            <span className="text-[10px] font-mono text-cyan-400/90 tracking-widest uppercase -mt-0.5">Research Laboratory</span>
          </div>
        </Link>

        {/* Desktop Links Navigation */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5 bg-gray-950/80 p-2 rounded-full border border-gray-800/90 backdrop-blur-2xl shadow-2xl">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isActive
                    ? item.danger
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : item.danger
                    ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`
              }
            >
              <i className={`fas ${item.icon} text-xs`} aria-hidden="true"></i>
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-3">
          
          {/* Cluster Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-gray-900/90 border border-gray-800 rounded-full text-xs font-mono text-gray-300 shadow-inner" role="status">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" aria-hidden="true"></span>
            <span>Cluster Online</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Disable audio synth effects' : 'Enable audio synth effects'}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              soundEnabled
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-gray-900/90 border-gray-800 text-gray-400 hover:text-white'
            }`}
            title="Toggle Web Audio Synth Effects"
          >
            <i className={`fas ${soundEnabled ? 'fa-volume-up text-purple-400' : 'fa-volume-mute'}`} aria-hidden="true"></i>
            <span className="hidden md:inline">{soundEnabled ? 'Audio On' : 'Mute'}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle system notifications feed"
              aria-expanded={showNotifications}
              aria-controls="notifications-dropdown"
              className="w-9 h-9 rounded-full bg-gray-900/90 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="Notifications"
            >
              <i className="fas fa-bell text-xs" aria-hidden="true"></i>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" aria-hidden="true"></span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" aria-hidden="true"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  id="notifications-dropdown"
                  role="region"
                  aria-label="System Notifications Feed"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-gray-950 border border-gray-800 rounded-2xl p-4 shadow-2xl z-50 text-left"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-white">System Feed</span>
                    <span className="text-[10px] font-mono bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Live Updates</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-xs">
                      <div className="font-bold text-cyan-400">Substack RSS Synced</div>
                      <div className="text-gray-400 mt-0.5">20 research papers indexed and typeset with KaTeX formulas.</div>
                    </div>
                    <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-xs">
                      <div className="font-bold text-purple-400">Model Checkpoint Release</div>
                      <div className="text-gray-400 mt-0.5">Hoosha-CFM-7B weights available in Safetensors format.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ⌘K Search Button */}
          <button
            onClick={openSpotlight}
            aria-label="Open search spotlight (Cmd+K)"
            className="hidden sm:flex items-center gap-2 bg-gray-900/90 hover:bg-gray-800 text-gray-300 px-3.5 py-1.5 rounded-full border border-gray-800 text-xs font-mono transition-colors shadow-inner focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            title="Search Everything (Cmd+K)"
          >
            <i className="fas fa-search text-cyan-400 text-[11px]" aria-hidden="true"></i>
            <span>Search</span>
            <kbd className="bg-black border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-400">⌘K</kbd>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu-drawer"
            className="lg:hidden w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-950/98 border-b border-gray-800 backdrop-blur-2xl overflow-hidden mt-3"
          >
            <nav aria-label="Mobile Navigation" className="px-6 py-6 space-y-3 text-left">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3.5 rounded-xl text-sm font-mono transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                      isActive
                        ? item.danger
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : item.danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <i className={`fas ${item.icon} text-base w-5`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <button
                  onClick={() => { setIsOpen(false); openSpotlight(); }}
                  className="flex-1 py-3 bg-black border border-gray-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
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
