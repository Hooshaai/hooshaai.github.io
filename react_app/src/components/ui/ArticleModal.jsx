import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSubstackArticleModalHTML } from '../../utils/articleContent';
import { renderMathInElement } from '../../utils/renderMath';

const ArticleModal = ({ article, onClose }) => {
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBibtex, setShowBibtex] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default font size
  const [toc, setToc] = useState([]);
  
  // TTS State
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const synth = window.speechSynthesis;
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0]);
      }
    };
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
    return () => {
      synth.cancel(); // Stop speaking on unmount
    };
  }, []);

  const handlePlayPause = () => {
    const synth = window.speechSynthesis;
    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      synth.cancel();
      const textToSpeak = contentRef.current?.innerText || article.title;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
      synth.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
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
      <div className="hidden lg:block w-72 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-6">Contents</h3>
        <ul className="space-y-3">
          {toc.map(item => (
            <li key={item.id} className={item.level === 'H3' ? 'ml-4' : ''}>
              <button 
                onClick={() => scrollToHeading(item.id)}
                className="text-left text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto relative" onScroll={handleScroll}>
        {/* Reading Progress Bar */}
        <div className="sticky top-0 left-0 w-full h-1.5 bg-gray-900 z-50">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${scrollProgress}%` }}></div>
        </div>

        {/* Sticky Nav Header */}
        <div className="sticky top-1.5 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-40 p-4 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded">A-</button>
            <button onClick={() => setFontSize(18)} className="text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded">Reset</button>
            <button onClick={() => setFontSize(Math.min(30, fontSize + 2))} className="text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded">A+</button>
          </div>
          <div className="flex items-center gap-4">
             {/* TTS Controls */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1 mr-4">
              <select 
                className="bg-transparent text-xs text-gray-300 max-w-24 outline-none mr-2"
                onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                value={selectedVoice?.name || ''}
              >
                {voices.map(v => <option key={v.name} value={v.name} className="bg-gray-900">{v.name}</option>)}
              </select>
              <button onClick={handlePlayPause} className="text-cyan-400 hover:text-white w-8 h-8 flex items-center justify-center rounded bg-gray-700 mx-1">
                <i className={`fas ${isPlaying && !isPaused ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button onClick={handleStop} className="text-red-400 hover:text-white w-8 h-8 flex items-center justify-center rounded bg-gray-700 mx-1" disabled={!isPlaying}>
                <i className="fas fa-stop"></i>
              </button>
            </div>

            <button onClick={() => setShowBibtex(true)} className="text-gray-400 hover:text-cyan-400"><i className="fas fa-quote-right mr-2"></i>Cite</button>
            <button onClick={() => window.print()} className="text-gray-400 hover:text-white"><i className="fas fa-print mr-2"></i>Print</button>
            <button onClick={onClose} className="text-gray-400 hover:text-red-400 ml-4"><i className="fas fa-times text-2xl"></i></button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full max-w-4xl mx-auto min-h-screen p-8 md:p-16 relative"
        >
          
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              {article.categoryName}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6 leading-tight">{article.title}</h1>
            <div className="text-gray-400 font-mono text-sm mb-10 flex items-center justify-center gap-4">
              <span><i className="fas fa-calendar-alt mr-2 text-cyan-400"></i>{article.pubDate || 'Oct 2026'}</span>
              <span>•</span>
              <span><i className="fas fa-clock mr-2 text-purple-400"></i>{article.readTime || '8 min read'}</span>
            </div>
          </div>

          <div 
            className="article-content prose prose-invert prose-lg max-w-none text-gray-300 font-['Inter']" 
            ref={contentRef}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
            onClick={(e) => { if(e.target === e.currentTarget) setShowBibtex(false); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-2xl relative shadow-2xl"
            >
              <button onClick={() => setShowBibtex(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
              <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk'] flex items-center"><i className="fas fa-book text-cyan-400 mr-3"></i>Citation (BibTeX)</h3>
              <div className="bg-black p-4 rounded-xl border border-gray-800 relative">
                <button 
                  onClick={() => { navigator.clipboard.writeText(bibtexString); alert('Copied!'); }}
                  className="absolute top-3 right-3 text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded"
                >
                  <i className="fas fa-copy mr-1"></i> Copy
                </button>
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{bibtexString}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleModal;
