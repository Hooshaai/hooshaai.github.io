import React, { useState, useEffect } from 'react';
import { FileEdit, Send, History, Trash2, Sparkles, BookOpen, User, Tag, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const CmsPublisher = () => {
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsCategory, setCmsCategory] = useState('Research Paper');
  const [cmsAuthor, setCmsAuthor] = useState('Hoosha AI Lab');
  const [cmsContent, setCmsContent] = useState('');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'history'
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('hoosha_cms_articles') || '[]');
    setPublishedArticles(saved);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!cmsTitle.trim() || !cmsContent.trim()) return;

    const wordCount = cmsContent.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const articleData = {
      title: cmsTitle,
      summary: cmsContent.substring(0, 120) + '...',
      content: cmsContent,
      category: cmsCategory.toLowerCase().replace(/\s+/g, '-'),
      categoryName: cmsCategory,
      author: cmsAuthor,
      wordCount: `${wordCount} words`,
      readTime: readTime,
      is_published: true,
      pubDate: new Date().toUTCString()
    };

    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch('/api/v1/articles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(articleData)
      });
      if (response.ok) {
        triggerToast('Published successfully to API!');
        setCmsTitle('');
        setCmsContent('');
        return;
      }
      throw new Error('Backend unavailable');
    } catch (err) {
      console.warn('Backend API unavailable, saving to local storage fallback', err);
      const newArticle = {
        id: `cms-${Date.now()}`,
        ...articleData,
        link: '#'
      };
      const updated = [newArticle, ...publishedArticles];
      setPublishedArticles(updated);
      localStorage.setItem('hoosha_cms_articles', JSON.stringify(updated));
      setCmsTitle('');
      setCmsContent('');
      triggerToast('Article published to local storage!');
    }
  };

  const handleDeleteDraft = (id) => {
    const updated = publishedArticles.filter(a => a.id !== id);
    setPublishedArticles(updated);
    localStorage.setItem('hoosha_cms_articles', JSON.stringify(updated));
    triggerToast('Draft deleted.');
  };

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 md:p-8 flex flex-col hover:border-cyan-500/30 transition-colors shadow-[0_0_40px_rgba(0,0,0,0.8)] font-mono relative overflow-hidden">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-4 right-4 bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 animate-fadeIn z-20">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              Research Studio CMS
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Author and publish scientific blog posts & technical papers</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
              activeTab === 'editor' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Composer
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Drafts ({publishedArticles.length})
          </button>
        </div>
      </div>

      {/* Editor Tab */}
      {activeTab === 'editor' ? (
        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" /> Article Category
              </label>
              <select
                value={cmsCategory}
                onChange={(e) => setCmsCategory(e.target.value)}
                className="w-full bg-black/90 border border-zinc-800/90 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              >
                <option value="Research Paper">Research Paper</option>
                <option value="System Architecture">System Architecture</option>
                <option value="CUDA Optimization">CUDA Optimization</option>
                <option value="Benchmark Release">Benchmark Release</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
                <User className="w-3 h-3 text-cyan-400" /> Author / Affiliate
              </label>
              <input
                type="text"
                value={cmsAuthor}
                onChange={(e) => setCmsAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full bg-black/90 border border-zinc-800/90 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" /> Article Title
            </label>
            <input
              id="cms-article-title"
              name="cmsArticleTitle"
              aria-label="Article Title"
              type="text"
              placeholder="e.g. FlashAttention-3: Fast and Memory-Efficient Exact Attention with FP8"
              value={cmsTitle}
              onChange={(e) => setCmsTitle(e.target.value)}
              className="w-full bg-black/90 border border-zinc-800/90 rounded-xl p-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all placeholder-zinc-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Content & Abstract Markdown
            </label>
            <textarea
              id="cms-article-content"
              name="cmsArticleContent"
              aria-label="Article Content Snippet"
              placeholder="Write paper abstract, equations, or benchmark results..."
              value={cmsContent}
              onChange={(e) => setCmsContent(e.target.value)}
              className="w-full bg-black/90 border border-zinc-800/90 rounded-xl p-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all h-36 resize-none placeholder-zinc-600 font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!cmsTitle.trim() || !cmsContent.trim()}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest uppercase text-xs py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4 fill-black" /> Publish to CMS Platform
          </button>
        </form>
      ) : (
        /* History Drafts Tab */
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {publishedArticles.length > 0 ? (
            publishedArticles.map((art) => (
              <div
                key={art.id}
                className="bg-black/90 border border-zinc-800 rounded-xl p-4 flex justify-between items-start gap-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-cyan-950 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded uppercase font-bold">
                      {art.categoryName || 'Research'}
                    </span>
                    <span className="text-zinc-500">{art.readTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{art.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{art.summary}</p>
                </div>
                <button
                  onClick={() => handleDeleteDraft(art.id)}
                  className="text-zinc-500 hover:text-rose-400 p-1.5 transition-colors shrink-0"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-500 text-xs font-mono">
              No published articles found in local registry.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CmsPublisher;
