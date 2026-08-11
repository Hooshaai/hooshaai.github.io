import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSubstackArticleModalHTML } from '../../utils/articleContent';
import katex from 'katex';

const ArticleModal = ({ article, onClose }) => {
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBibtex, setShowBibtex] = useState(false);

  useEffect(() => {
    if (contentRef.current && article) {
      const html = article.content || generateSubstackArticleModalHTML(article);
      contentRef.current.innerHTML = html;
      
      try {
        if (window.renderMathInElement) {
          window.renderMathInElement(contentRef.current, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\(', right: '\)', display: false},
              {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
          });
        }
      } catch (e) {
        console.error('KaTeX render error:', e);
      }
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
    setScrollProgress(progress);
  };

  const bibtexString = `@article{hoosha2026${article.id},
  title={${article.title}},
  author={${article.author || 'Majlesi, Mohammad Taha'}},
  journal={Hoosha AI Research Journal},
  year={2026},
  url={${article.link}}
}`;

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-y-auto flex justify-center" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }} onScroll={handleScroll}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-900 z-50">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-gray-900/50 border-x border-gray-800 w-full max-w-4xl min-h-screen p-8 md:p-16 relative"
      >
        <button className="fixed top-8 right-8 text-gray-400 hover:text-white bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border border-gray-700 transition-colors z-50" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            {article.categoryName}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6 leading-tight">{article.title}</h1>
          <div className="text-gray-400 font-mono text-sm mb-10 flex items-center justify-center gap-4">
            <span><i className="fas fa-calendar-alt mr-2 text-cyan-400"></i>{article.pubDate}</span>
            <span>•</span>
            <span><i className="fas fa-clock mr-2 text-purple-400"></i>{article.readTime}</span>
            <span>•</span>
            <span><i className="fas fa-file-word mr-2 text-green-400"></i>{article.wordCount}</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-left bg-black/40 inline-flex p-4 rounded-2xl border border-gray-800">
            <div className="w-14 h-14 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold text-2xl border border-cyan-500/50 shadow-inner">
              {article.author ? article.author[0] : 'A'}
            </div>
            <div>
              <div className="font-bold text-lg">{article.author || 'Author'}</div>
              <div className="text-sm text-gray-500 font-mono">{article.authorRole || 'Researcher'}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-16 border-b border-gray-800 pb-12">
          <button onClick={() => setShowBibtex(true)} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors font-medium border border-gray-700">
            <i className="fas fa-quote-right mr-2 text-cyan-400"></i>Cite (BibTeX)
          </button>
          <button onClick={() => window.print()} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors font-medium border border-gray-700">
            <i className="fas fa-file-pdf mr-2 text-red-400"></i>Export PDF
          </button>
          <a href={article.link} target="_blank" rel="noreferrer" className="bg-white text-black hover:bg-cyan-400 px-6 py-3 rounded-xl transition-colors font-bold shadow-lg">
            <i className="fas fa-external-link-alt mr-2"></i>Read on Substack
          </a>
        </div>

        <div className="article-content prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-['Inter']" ref={contentRef}>
          {/* Content injected here */}
        </div>
      </motion.div>

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
