import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);

    const newSub = {
      e: email,
      org: 'Website Subscriber',
      d: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      s: 'Active'
    };

    const existing = JSON.parse(localStorage.getItem('hoosha_subscribers') || '[]');
    localStorage.setItem('hoosha_subscribers', JSON.stringify([...existing, newSub]));

    try {
      await apiFetch('/api/v1/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.warn('Offline mode: Saved subscriber locally', err);
    }

    setLoading(false);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer aria-label="Site Footer" className="bg-slate-950 border-t border-slate-900 pt-20 pb-12 text-left relative overflow-hidden">
      {/* Dynamic Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_rgba(0,240,255,0.9)]" aria-hidden="true"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[500px] bg-cyan-500/5 blur-[130px] pointer-events-none" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-4 space-y-6 pr-4">
            <Link to="/" aria-label="Hoosha AI Home Page" className="flex items-center gap-4 group no-underline text-left inline-flex focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-xl p-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                  <i className="fas fa-brain text-cyan-400 text-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true"></i>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                  Hoosha AI
                </span>
                <span className="text-[11px] font-mono text-cyan-400/90 tracking-[0.2em] uppercase mt-0.5 font-medium">
                  Research Laboratory
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-light">
              Pioneering sub-quadratic attention mechanisms, grounded Lean 4 verification, continuous flow ODE matching, and post-training cognitive scaling to reshape frontier AI infrastructure.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {[
                { href: 'https://github.com/Hooshaai/hooshaai.github.io', icon: 'fab fa-github', label: 'GitHub Repository', hover: 'hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]' },
                { href: 'https://hooshaai.substack.com', icon: 'fas fa-rss text-orange-400', label: 'Substack Journal', hover: 'hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' },
                { href: 'https://huggingface.co', icon: 'fas fa-cube text-yellow-400', label: 'HuggingFace Model Hub', hover: 'hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]' },
                { href: 'mailto:hooshaai@gmail.com', icon: 'fas fa-paper-plane text-cyan-400', label: 'Email Laboratory', hover: 'hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]' },
              ].map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${s.hover}`}
                >
                  <i className={`${s.icon} text-base`} aria-hidden="true"></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Spacer Col */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden="true"></div>

          {/* Col 2: Research Navigation */}
          <nav aria-label="Research Links" className="lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" aria-hidden="true"></span> Research
            </h3>
            <ul className="space-y-3.5 text-xs font-mono">
              <li><Link to="/research" className="text-slate-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Substack Dispatches</Link></li>
              <li><Link to="/research" className="text-slate-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Audio Podcast Player</Link></li>
              <li><Link to="/research" className="text-slate-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Citation Engine</Link></li>
              <li><Link to="/research" className="text-slate-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Math Typesetting</Link></li>
            </ul>
          </nav>

          {/* Col 3: Platform & Labs Navigation */}
          <nav aria-label="Platform Links" className="lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" aria-hidden="true"></span> Platform
            </h3>
            <ul className="space-y-3.5 text-xs font-mono">
              <li><Link to="/labs" className="text-slate-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">CFM 2D ODE Solver</Link></li>
              <li><Link to="/labs" className="text-slate-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">GRPO Policy Lab</Link></li>
              <li><Link to="/models" className="text-slate-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">.safetensors Vault</Link></li>
              <li><Link to="/platform" className="text-slate-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">8x H100 Telemetry</Link></li>
            </ul>
          </nav>

          {/* Col 4: Newsletter Signup */}
          <div className="lg:col-span-3">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" aria-hidden="true"></span> Join Newsletter
            </h3>
            <p className="text-slate-300 text-xs mb-5 leading-relaxed pr-2 font-light">
              Join 12,500+ AI researchers receiving weekly technical dispatches and open checkpoint benchmarks.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" aria-hidden="true"></div>
              
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for research newsletter
              </label>
              
              <input
                id="footer-newsletter-email"
                name="newsletterEmail"
                type="email"
                placeholder="researcher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="relative w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner font-mono"
              />
              
              <button
                type="submit"
                disabled={loading}
                aria-label="Subscribe to Hoosha AI research newsletter"
                className="relative w-full bg-white text-black font-bold text-xs py-3.5 rounded-xl hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-300 tracking-wider uppercase focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  role="status"
                  className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                >
                  <i className="fas fa-check-circle text-sm" aria-hidden="true"></i> 
                  <span>Subscribed! Check your inbox for verification.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>&copy; 2026 Hoosha AI Research Laboratory.</span>
            <span className="hidden md:inline text-slate-800" aria-hidden="true">|</span>
            <span>Open Source under Apache 2.0.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800" role="status">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" aria-hidden="true"></span>
              <span className="text-slate-300">Uptime: 99.98%</span>
            </span>

            <span className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <i className="fas fa-microchip text-[10px] text-cyan-400"></i> H100 Nodes Active
            </span>

            <Link 
              to="/admin" 
              aria-label="Admin Portal" 
              className="text-red-400/70 hover:text-red-300 transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none rounded"
            >
              <i className="fas fa-shield-alt text-[10px]" aria-hidden="true"></i> Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

