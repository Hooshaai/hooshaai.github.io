import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

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

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer aria-label="Site Footer" className="bg-gray-950 border-t border-gray-900 pt-20 pb-12 text-left relative overflow-hidden">
      {/* Dynamic Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent shadow-[0_0_20px_rgba(0,240,255,0.8)]" aria-hidden="true"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Col 1: Brand & Description (Spans 4) */}
          <div className="lg:col-span-4 space-y-6 pr-4">
            <Link to="/" aria-label="Hoosha AI Home Page" className="flex items-center gap-4 group no-underline text-left inline-flex focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-xl p-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
                <div className="w-full h-full bg-gray-950 rounded-[15px] flex items-center justify-center">
                  <i className="fas fa-brain text-cyan-400 text-xl group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">Hoosha AI</span>
                <span className="text-[11px] font-mono text-cyan-400/90 tracking-[0.2em] uppercase mt-0.5">Research Laboratory</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-light">
              Pioneering sub-quadratic attention mechanisms, grounded causal verification, and post-training cognitive scaling to reshape frontier AI infrastructure.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="https://github.com/Hooshaai/hooshaai.github.io" target="_blank" rel="noreferrer" aria-label="GitHub Repository (opens in new tab)" className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none">
                <i className="fab fa-github text-base" aria-hidden="true"></i>
              </a>
              <a href="https://hooshaai.substack.com" target="_blank" rel="noreferrer" aria-label="Substack Journal (opens in new tab)" className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
                <i className="fas fa-rss text-base text-orange-400/80 group-hover:text-orange-400" aria-hidden="true"></i>
              </a>
              <a href="https://huggingface.co" target="_blank" rel="noreferrer" aria-label="HuggingFace Model Hub (opens in new tab)" className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none">
                <i className="fas fa-cube text-base text-yellow-400/80 group-hover:text-yellow-400" aria-hidden="true"></i>
              </a>
              <a href="mailto:hooshaai@gmail.com" aria-label="Email Hoosha AI Research Laboratory" className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none">
                <i className="fas fa-paper-plane text-base text-cyan-400/80 group-hover:text-cyan-400" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* Spacer Col */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden="true"></div>

          {/* Col 2: Research Navigation (Spans 2) */}
          <nav aria-label="Research Links" className="lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" aria-hidden="true"></span> Research
            </h3>
            <ul className="space-y-4 text-xs font-mono">
              <li><Link to="/research" className="text-gray-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Substack Dispatches</Link></li>
              <li><Link to="/research" className="text-gray-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Audio Podcast Player</Link></li>
              <li><Link to="/research" className="text-gray-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Citation Engine</Link></li>
              <li><Link to="/research" className="text-gray-300 hover:text-cyan-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">Math Typesetting</Link></li>
            </ul>
          </nav>

          {/* Col 3: Platform & Labs (Spans 2) */}
          <nav aria-label="Platform Links" className="lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" aria-hidden="true"></span> Platform
            </h3>
            <ul className="space-y-4 text-xs font-mono">
              <li><Link to="/labs" className="text-gray-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">CFM 2D ODE Solver</Link></li>
              <li><Link to="/labs" className="text-gray-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">GRPO Policy Lab</Link></li>
              <li><Link to="/models" className="text-gray-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">.safetensors Vault</Link></li>
              <li><Link to="/platform" className="text-gray-300 hover:text-purple-400 hover:translate-x-1 inline-block transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded">8x H100 Telemetry</Link></li>
            </ul>
          </nav>

          {/* Col 4: Substack Newsletter Signup (Spans 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" aria-hidden="true"></span> Join Newsletter
            </h3>
            <p className="text-gray-300 text-xs mb-5 leading-relaxed pr-2 font-light">
              Join 12,500+ AI researchers getting our weekly technical dispatches directly in their inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" aria-hidden="true"></div>
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
                className="relative w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner font-mono"
              />
              <button
                type="submit"
                aria-label="Subscribe to Hoosha AI research newsletter"
                className="relative w-full bg-white text-black font-bold text-xs py-3.5 rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:text-black transition-all duration-300 tracking-wide uppercase focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <div role="status" className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <i className="fas fa-check-circle" aria-hidden="true"></i> Subscribed! Check your inbox.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>&copy; 2026 Hoosha AI Research Laboratory.</span>
            <span className="hidden md:inline text-gray-800" aria-hidden="true">|</span>
            <span>Open source under Apache 2.0.</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800/50" role="status">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" aria-hidden="true"></span>
              <span className="text-gray-300">Uptime: 99.98%</span>
            </span>
            <Link to="/admin" aria-label="Admin Portal" className="text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none rounded">
              <i className="fas fa-shield-alt" aria-hidden="true"></i> Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
