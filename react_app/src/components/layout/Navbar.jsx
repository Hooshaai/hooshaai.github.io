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
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
            <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
              <i className="fas fa-brain text-cyan-400 text-lg group-hover:scale-110 transition-transform"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-wide">Hoosha AI</span>
            <span className="text-[10px] font-mono text-cyan-400/80 -mt-1 tracking-widest uppercase">Research Lab</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-full border border-gray-800/80 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
                  isActive
                    ? item.danger
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                      : 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : item.danger
                    ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <i className={`fas ${item.icon} text-[11px]`}></i>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cluster Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 border border-gray-800 rounded-full text-xs font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-300">Cluster Online</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white'
            }`}
            title="Toggle Web Audio Synth Effects"
          >
            <i className={`fas ${soundEnabled ? 'fa-volume-up text-purple-400' : 'fa-volume-mute'}`}></i>
            <span className="hidden md:inline">{soundEnabled ? 'Audio On' : 'Mute'}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <i className="fas fa-bell text-xs"></i>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl z-50 text-left"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-white">System Feed</span>
                    <span className="text-[10px] font-mono bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Live Updates</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-gray-800 text-xs">
                      <div className="font-bold text-cyan-400">Substack RSS Synced</div>
                      <div className="text-gray-400 mt-0.5">20 research papers indexed and typeset with KaTeX formulas.</div>
                    </div>
                    <div className="p-2.5 bg-black/40 rounded-xl border border-gray-800 text-xs">
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
            className="hidden sm:flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 text-gray-300 px-3.5 py-1.5 rounded-full border border-gray-800 text-xs font-mono transition-colors shadow-inner"
            title="Search Everything (Cmd+K)"
          >
            <i className="fas fa-search text-cyan-400 text-[11px]"></i>
            <span>Search</span>
            <kbd className="bg-black border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-400">⌘K</kbd>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900/95 border-b border-gray-800 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl text-sm font-mono transition-colors ${
                      isActive
                        ? item.danger
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                        : item.danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <i className={`fas ${item.icon} text-base`}></i>
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <button
                  onClick={openSpotlight}
                  className="flex-1 py-2.5 bg-black border border-gray-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i> Search Everything (⌘K)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
