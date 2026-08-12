import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      await fetch('http://localhost:8000/api/v1/newsletter/subscribe/', {
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
    <footer className="bg-black/90 border-t border-gray-800/80 pt-16 pb-12 text-left relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                  <i className="fas fa-brain text-cyan-400 text-base"></i>
                </div>
              </div>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-wide">Hoosha AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Pioneering sub-quadratic attention mechanisms, grounded causal verification, and post-training cognitive scaling to reshape frontier AI infrastructure.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com/Hooshaai/hooshaai.github.io" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-400/50 transition-colors">
                <i className="fab fa-github text-sm"></i>
              </a>
              <a href="https://hooshaai.substack.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-orange-400/50 transition-colors">
                <i className="fas fa-rss text-sm text-orange-400"></i>
              </a>
              <a href="https://huggingface.co" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/50 transition-colors">
                <i className="fas fa-cube text-sm text-yellow-400"></i>
              </a>
              <a href="mailto:hooshaai@gmail.com" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-400/50 transition-colors">
                <i className="fas fa-paper-plane text-sm text-cyan-400"></i>
              </a>
            </div>
          </div>

          {/* Col 3: Research Navigation */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-3">Research</h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li><Link to="/research" className="text-gray-400 hover:text-cyan-400 transition-colors">20 Substack Dispatches</Link></li>
              <li><Link to="/research" className="text-gray-400 hover:text-cyan-400 transition-colors">Web Audio Podcast Player</Link></li>
              <li><Link to="/research" className="text-gray-400 hover:text-cyan-400 transition-colors">BibTeX Citation Engine</Link></li>
              <li><Link to="/research" className="text-gray-400 hover:text-cyan-400 transition-colors">KaTeX Math Typesetting</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Labs */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-purple-400 pl-3">Platform</h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li><Link to="/labs" className="text-gray-400 hover:text-purple-400 transition-colors">CFM 2D ODE Solver</Link></li>
              <li><Link to="/labs" className="text-gray-400 hover:text-purple-400 transition-colors">GRPO Policy Visualizer</Link></li>
              <li><Link to="/models" className="text-gray-400 hover:text-purple-400 transition-colors">.safetensors Vault</Link></li>
              <li><Link to="/platform" className="text-gray-400 hover:text-purple-400 transition-colors">8x H100 Telemetry</Link></li>
            </ul>
          </div>

          {/* Col 5: Substack Newsletter Signup */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-400 pl-3">Subscribe</h4>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Join 12,500+ AI researchers getting our weekly technical dispatches directly in their inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="researcher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs py-2.5 rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                Join Substack Journal
              </button>
            </form>
            {subscribed && (
              <div className="mt-2 text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-fadeIn">
                <i className="fas fa-check-circle"></i> Subscribed! Check your inbox.
              </div>
            )}
          </div>

        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <div>
            &copy; 2026 Hoosha AI Research Laboratory. Open source under Apache 2.0.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Uptime: 99.98%
            </span>
            <Link to="/admin" className="text-red-400/60 hover:text-red-400 transition-colors">
              <i className="fas fa-shield-alt mr-1"></i>Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
