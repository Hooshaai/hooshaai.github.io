import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';

const CmsPublisher = () => {
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsContent, setCmsContent] = useState('');

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!cmsTitle || !cmsContent) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch('/api/v1/articles/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: cmsTitle,
          summary: cmsContent.substring(0, 100),
          content: cmsContent,
          is_published: true
        })
      });
      if (response.ok) {
        alert('Published successfully to API!');
        setCmsTitle('');
        setCmsContent('');
        return;
      }
      throw new Error('Backend failed');
    } catch (err) {
      const newArticle = {
        id: `cms-${Date.now()}`,
        title: cmsTitle,
        link: '#',
        pubDate: new Date().toUTCString(),
        wordCount: `${cmsContent.split(' ').length} words`,
        readTime: '1 min read',
        snippet: cmsContent.substring(0, 100) + '...',
        category: 'research',
        categoryName: 'CMS Publish',
        author: 'Admin',
        authorRole: 'Hoosha AI'
      };
      const existing = JSON.parse(localStorage.getItem('hoosha_cms_articles') || '[]');
      localStorage.setItem('hoosha_cms_articles', JSON.stringify([newArticle, ...existing]));
      setCmsTitle('');
      setCmsContent('');
      alert('Published successfully to local storage (fallback)!');
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/30 transition-colors">
      <h2 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] flex items-center tracking-tight text-white">
        <i className="fas fa-edit text-gray-400 mr-3"></i>Research Studio CMS
      </h2>
      <form onSubmit={handlePublish} className="flex flex-col gap-5">
        <input 
          id="cms-article-title"
          name="cmsArticleTitle"
          aria-label="Article Title"
          type="text" 
          placeholder="Article Title" 
          value={cmsTitle}
          onChange={e => setCmsTitle(e.target.value)}
          className="bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-white/30 focus:outline-none transition-all placeholder-gray-600 tracking-wide font-light"
        />
        <textarea 
          id="cms-article-content"
          name="cmsArticleContent"
          aria-label="Article Content Snippet"
          placeholder="Article Content Snippet..." 
          value={cmsContent}
          onChange={e => setCmsContent(e.target.value)}
          className="bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-white/30 focus:outline-none transition-all h-36 resize-none placeholder-gray-600 tracking-wide font-light leading-relaxed"
        />
        <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold tracking-widest uppercase text-[10px] py-4 rounded-xl transition-colors">
          Publish Article
        </button>
      </form>
    </div>
  );
};

export default CmsPublisher;
