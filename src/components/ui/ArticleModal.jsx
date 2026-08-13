import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSubstackArticleModalHTML } from '../../utils/articleContent';
import { renderMathInElement } from '../../utils/renderMath';
import useTTSPlayer from '../../hooks/useTTSPlayer';

const ArticleModal = ({ article, onClose }) => {
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBibtex, setShowBibtex] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default font size
  const [toc, setToc] = useState([]);

  // Consume Global TTS Hook
  const {
    isPlaying,
    isPaused,
    currentArticle,
    voices,
    selectedVoice,
    togglePlay,
    stop,
    changeVoice,
  } = useTTSPlayer();

  const isCurrentPlaying = currentArticle?.id === article?.id && isPlaying;

  const handlePlayPause = () => {
    togglePlay(article);
  };

  useEffect(() => {
    if (contentRef.current && article) {
      const html = article.content || generateSubstackArticleModalHTML(article);
      contentRef.current.innerHTML = html;
      
      try {
        renderMathInElement(contentRef.current);
      } catch (e) {
        console.error('KaTeX render error:', e);
      }

      // Generate TOC
      const headings = Array.from(contentRef.current.querySelectorAll('h2, h3'));
      const tocItems = headings.map((h, i) => {
        const id = h.id || `heading-${i}`;
        h.id = id;
        return { id, text: h.innerText, level: h.tagName };
      });
      setToc(tocItems);
    }
    
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !showBibtex) onClose();
      if (e.key === 'Escape' && showBibtex) setShowBibtex(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [article, onClose, showBibtex]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress || 0);
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const bibtexString = `@article{hoosha2026${article?.id},
  title={${article?.title}},
  author={${article?.author || 'Majlesi, Mohammad Taha'}},
  journal={Hoosha AI Research Journal},
  year={2026},
  url={${article?.link}}
}`;

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      
      {/* Table of Contents Drawer */}
      <div className="hidden lg:block w-72 bg-black border-r border-white/20 p-6 overflow-y-auto font-mono">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-6">Contents</h3>
        <ul className="space-y-3">
          {toc.map(item => (
            <li key={item.id} className={item.level === 'H3' ? 'ml-4' : ''}>
              <button 
                onClick={() => scrollToHeading(item.id)}
                className="text-left text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto relative" onScroll={handleScroll}>
        {/* Reading Progress Bar */}
        <div className="sticky top-0 left-0 w-full h-1.5 bg-black/60 z-50">
          <div 
            className="h-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] transition-all duration-100" 
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Sticky Nav Header */}
        <div className="sticky top-1.5 w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/10 z-40 p-4 flex justify-between items-center px-6 md:px-10 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/15 rounded-lg p-1">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="text-gray-300 hover:text-cyan-400 px-2.5 py-1 hover:bg-white/10 rounded font-bold transition-all" title="Decrease font size">A-</button>
              <span className="text-zinc-500 px-1">|</span>
              <button onClick={() => setFontSize(18)} className="text-gray-300 hover:text-cyan-400 px-2 py-1 hover:bg-white/10 rounded font-bold transition-all">18px</button>
              <span className="text-zinc-500 px-1">|</span>
              <button onClick={() => setFontSize(Math.min(30, fontSize + 2))} className="text-gray-300 hover:text-cyan-400 px-2.5 py-1 hover:bg-white/10 rounded font-bold transition-all" title="Increase font size">A+</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* TTS Controls */}
            <div className="flex items-center bg-white/5 border border-white/15 rounded-lg p-1.5">
              {voices.length > 0 && (
                <select 
                  id="tts-voice-select"
                  name="ttsVoice"
                  aria-label="Select TTS Voice"
                  className="bg-transparent text-xs text-gray-200 max-w-28 outline-none mr-2 cursor-pointer font-mono"
                  onChange={(e) => changeVoice(e.target.value)}
                  value={selectedVoice?.name || ''}
                >
                  {voices.map(v => <option key={v.name} value={v.name} className="bg-slate-900 text-white">{v.name}</option>)}
                </select>
              )}
              <button 
                onClick={handlePlayPause} 
                className={`w-8 h-8 flex items-center justify-center rounded-md font-bold transition-all ${
                  isCurrentPlaying && !isPaused
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-white/15 text-white hover:bg-cyan-400 hover:text-black'
                }`}
                title={isCurrentPlaying && !isPaused ? 'Pause Audio' : 'Listen to Article'}
                aria-label={isCurrentPlaying && !isPaused ? 'Pause Audio' : 'Listen to Article'}
              >
                <i className={`fas ${isCurrentPlaying && !isPaused ? 'fa-pause' : 'fa-play'} text-xs`}></i>
              </button>
              <button 
                onClick={stop} 
                className="text-gray-400 hover:text-red-400 w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30 disabled:hover:text-gray-400" 
                disabled={!isCurrentPlaying}
                title="Stop Audio"
                aria-label="Stop Audio"
              >
                <i className="fas fa-stop text-xs"></i>
              </button>
            </div>

            <button onClick={() => setShowBibtex(true)} className="text-gray-300 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2">
              <i className="fas fa-quote-right text-cyan-400"></i>
              <span>Cite</span>
            </button>
            <button onClick={() => window.print()} className="text-gray-300 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2">
              <i className="fas fa-print text-gray-400"></i>
              <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 p-2 rounded-lg transition-all ml-2" aria-label="Close modal">
              <i className="fas fa-times text-base"></i>
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="w-full max-w-4xl mx-auto min-h-screen p-6 md:p-14 relative"
        >
          
          <div className="text-center mb-14 pb-8 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono mb-6 font-bold shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {article.categoryName}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-6 leading-tight text-white tracking-tight">{article.title}</h1>
            
            <div className="text-gray-400 font-mono text-xs md:text-sm mb-6 flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-2 text-slate-300">
                <i className="fas fa-user-circle text-cyan-400"></i>
                {article.author || 'Mohammad Taha Majlesi'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2 text-slate-300">
                <i className="fas fa-calendar-alt text-cyan-400"></i>
                {article.pubDate || 'Oct 2026'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2 text-slate-300">
                <i className="fas fa-clock text-cyan-400"></i>
                {article.readTime || '8 min read'}
              </span>
            </div>

            {article.snippet && (
              <p className="text-slate-400 italic text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-cyan-400/50 pl-4 text-left font-serif">
                "{article.snippet}"
              </p>
            )}
          </div>

          <div 
            className="article-content prose prose-invert prose-lg max-w-none text-slate-200 font-['Inter'] leading-relaxed" 
            ref={contentRef}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.85' }}
          >
            {/* Content injected here */}
          </div>
        </motion.div>
      </div>

      {/* BibTeX Modal */}
      <AnimatePresence>
        {showBibtex && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
            onClick={(e) => { if(e.target === e.currentTarget) setShowBibtex(false); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-black border border-white/30 p-8 rounded-2xl w-full max-w-2xl relative shadow-2xl font-mono"
            >
              <button onClick={() => setShowBibtex(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
              <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk'] flex items-center text-white"><i className="fas fa-book text-gray-300 mr-3"></i>Citation (BibTeX)</h3>
              <div className="bg-black p-4 rounded-xl border border-white/20 relative shadow-inner">
                <button 
                  onClick={() => { 
                    navigator.clipboard.writeText(bibtexString); 
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`absolute top-3 right-3 text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    copied 
                      ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copied ? 'Copied!' : 'Copy BibTeX'}</span>
                </button>
                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{bibtexString}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleModal;
