import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';

const Ecosystem = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLayer, setSelectedLayer] = useState(null);

  const tabs = ['All', 'Model', 'Framework', 'Kernel', 'Hardware'];
  
  const techStack = [
    { name: 'PyTorch', cat: 'Framework', tag: 'DL Engine', desc: 'Core deep learning framework for training and inference.', icon: 'fa-fire', status: 'Active' },
    { name: 'CUDA', cat: 'Kernel', tag: 'GPU Compute', desc: 'Hardware-level parallel programming & acceleration.', icon: 'fa-microchip', status: 'Core' },
    { name: 'Triton', cat: 'Kernel', tag: 'Custom Kernels', desc: 'Custom high-performance kernels for fused operations.', icon: 'fa-water', status: 'Optimized' },
    { name: 'HuggingFace', cat: 'Model', tag: 'Hub & Weights', desc: 'Model weights hosting and open community distribution.', icon: 'fa-cube', status: 'Verified' },
    { name: 'Substack', cat: 'Framework', tag: 'Research Hub', desc: 'Open research journal and architectural paper releases.', icon: 'fa-pen-nib', status: 'Publications' },
    { name: 'University of Tehran', cat: 'Hardware', tag: 'HPC Partner', desc: 'Academic partner & high-performance computing clusters.', icon: 'fa-university', status: 'Partner' },
    { name: 'Sharif University', cat: 'Hardware', tag: 'HPC Partner', desc: 'Academic partner for distributed systems research.', icon: 'fa-university', status: 'Partner' },
    { name: 'Python', cat: 'Framework', tag: 'Core Language', desc: 'Primary development language and ecosystem tooling.', icon: 'fa-code', status: 'Standard' }
  ];

  // Safe category matching helper (handles singular vs plural like Framework vs Frameworks)
  const isCategoryMatch = (techCat, tabName) => {
    if (tabName === 'All') return true;
    if (!techCat) return false;
    const catLower = techCat.toLowerCase().replace(/s$/, '');
    const tabLower = tabName.toLowerCase().replace(/s$/, '');
    return catLower === tabLower;
  };

  // Tab counts calculation
  const tabCounts = useMemo(() => {
    const counts = { All: techStack.length };
    tabs.slice(1).forEach(tab => {
      counts[tab] = techStack.filter(t => isCategoryMatch(t.cat, tab)).length;
    });
    return counts;
  }, [techStack]);

  // Filtered tech stack items
  const filteredTech = useMemo(() => {
    return techStack.filter(t => {
      const matchesTab = isCategoryMatch(t.cat, activeTab);
      const matchesLayer = !selectedLayer || isCategoryMatch(t.cat, selectedLayer);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (t.name || '').toLowerCase().includes(q) ||
        (t.cat || '').toLowerCase().includes(q) ||
        (t.desc || '').toLowerCase().includes(q) ||
        (t.tag || '').toLowerCase().includes(q);
      return matchesTab && matchesLayer && matchesSearch;
    });
  }, [techStack, activeTab, selectedLayer, searchQuery]);

  const architectureLayers = [
    { 
      name: 'Model Layer', 
      catKey: 'Model',
      title: 'Foundation Checkpoints & Reasoners',
      desc: 'Flow-matching weights, GRPO reasoning models, and multimodal foundation checkpoints.',
      techs: ['Hoosha CFM-7B', 'GRPO Reasoner', 'Vision Flow']
    },
    { 
      name: 'Framework Layer', 
      catKey: 'Framework',
      title: 'PyTorch 2.x & Custom Pipelines',
      desc: 'High-level training pipelines, distributed orchestrators, and open evaluation suites.',
      techs: ['PyTorch 2.4', 'Python SDK', 'Substack Journal']
    },
    { 
      name: 'Kernel Layer', 
      catKey: 'Kernel',
      title: 'Optimized CUDA & Triton Kernels',
      desc: 'Fused FlashAttention-3 passes, FP8 matrix multiplications, and custom memory layout routines.',
      techs: ['Triton IR', 'CUDA C++', 'FP8 Fused GEMM']
    },
    { 
      name: 'Hardware Layer', 
      catKey: 'Hardware',
      title: 'Distributed Academic GPU Clusters',
      desc: 'Multi-node NVIDIA H100/A100 clusters hosted across partner academic institutions.',
      techs: ['University of Tehran Cluster', 'Sharif HPC', 'Infiniband Fabrics']
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Core':
        return 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]';
      case 'Optimized':
        return 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.15)]';
      case 'Partner':
        return 'text-blue-300 bg-blue-950/70 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.15)]';
      case 'Publications':
        return 'text-amber-300 bg-amber-950/70 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      default:
        return 'text-purple-300 bg-purple-950/70 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
    }
  };

  return (
    <div className="ecosystem-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative z-10 font-sans">
      <SEO 
        title="Tech Ecosystem"
        description="Explore the compute infrastructure, custom CUDA/Triton kernels, framework integrations, and academic HPC partnerships powering Hoosha AI."
        keywords="PyTorch, CUDA, Triton Kernels, HPC Clusters, High Performance Computing, Deep Learning Infrastructure"
      />

      {/* Ambient Background Blur */}
      <div 
        aria-hidden="true" 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" 
      />

      {/* Page Header */}
      <header className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_25px_rgba(0,240,255,0.15)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Open Research Ecosystem</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight text-white"
        >
          Tech <span className="bg-gradient-to-r from-cyan-400 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.35)]">Ecosystem</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light"
        >
          The compute infrastructure, custom kernels, frameworks, and academic partnerships powering Hoosha AI's research platform.
        </motion.p>
      </header>

      {/* Controls Bar: Tabs & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-slate-950/80 p-4 md:p-6 rounded-3xl border border-slate-800 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
      >
        {/* Category Tabs */}
        <div role="tablist" aria-label="Ecosystem Category Filter" className="flex flex-wrap gap-2">
          {tabs.map(tab => {
            const isSelected = activeTab === tab && !selectedLayer;
            return (
              <button 
                key={tab}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedLayer(null);
                }}
                className={`relative px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isSelected
                    ? 'text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white font-medium hover:bg-slate-900/80'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="ecosystemActiveTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-white rounded-full -z-10 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
                <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors ${
                  isSelected ? 'bg-black/20 text-black font-bold border border-black/20' : 'bg-slate-900 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {tabCounts[tab] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 group">
          <label htmlFor="ecosystem-search-input" className="sr-only">Search tech stack and tools</label>
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 text-xs transition-colors" aria-hidden="true"></i>
          <input 
            id="ecosystem-search-input"
            type="text"
            placeholder="Search stack & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </motion.div>

      {/* Layer Reset Indicator */}
      {selectedLayer && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          role="status" 
          className="mb-8 flex items-center justify-between bg-cyan-950/40 border border-cyan-500/40 px-5 py-3 rounded-2xl text-xs text-cyan-300 font-mono shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md"
        >
          <span className="flex items-center gap-2">
            <i className="fas fa-layer-group text-cyan-400" aria-hidden="true"></i> 
            <span>Filtered by Architecture Tier: <strong className="text-white uppercase font-bold">{selectedLayer} Layer</strong></span>
          </span>
          <button 
            onClick={() => setSelectedLayer(null)}
            className="hover:text-white text-cyan-400 font-bold underline cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
          >
            Clear Layer Filter
          </button>
        </motion.div>
      )}

      {/* Tech Stack Grid */}
      <section aria-label="Ecosystem Components Grid">
        {filteredTech.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-950/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-300 mb-20 backdrop-blur-xl max-w-md mx-auto" 
            role="status"
          >
            <i className="fas fa-search text-3xl text-slate-600 mb-3 block" aria-hidden="true"></i>
            <h2 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">No ecosystem components found</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 font-light">Try clearing your search query or resetting layer filters.</p>
            <button 
              onClick={() => { setActiveTab('All'); setSearchQuery(''); setSelectedLayer(null); }}
              className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            <AnimatePresence mode="popLayout">
              {filteredTech.map(tech => {
                const isLayerActive = selectedLayer && isCategoryMatch(tech.cat, selectedLayer);

                return (
                  <motion.article 
                    layout
                    key={tech.name} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
                    transition={{ duration: 0.3 }}
                    className={`group relative p-7 rounded-3xl flex flex-col items-center text-center backdrop-blur-2xl overflow-hidden transition-all duration-300 border shadow-[0_12px_40px_rgba(0,0,0,0.85)] ${
                      isLayerActive
                        ? 'bg-gradient-to-b from-cyan-950/60 via-slate-950/90 to-black border-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.25)]'
                        : 'bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-black/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_20px_50px_rgba(0,240,255,0.16)]'
                    }`}
                  >
                    {/* Top Glow Accent */}
                    <div 
                      aria-hidden="true"
                      className={`absolute top-0 left-6 right-6 h-[1.5px] transition-all duration-300 ${
                        isLayerActive
                          ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,240,255,1)] opacity-100'
                          : 'bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 group-hover:opacity-100'
                      }`}
                    />

                    {/* Ambient Corner Glow */}
                    <div 
                      aria-hidden="true" 
                      className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-400/20 group-hover:scale-125 transition-all duration-500" 
                    />

                    <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300 text-cyan-400 shadow-[0_0_20px_rgba(0,0,0,0.5)]" aria-hidden="true">
                      <i className={`fas ${tech.icon || 'fa-cube'} text-2xl text-cyan-400`}></i>
                    </div>
                    
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2 font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors">
                      {tech.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase border border-slate-800 px-2.5 py-0.5 rounded-full bg-slate-900/80">
                        {tech.cat}
                      </span>
                      {tech.status && (
                        <span className={`text-[10px] font-mono tracking-wider border px-2.5 py-0.5 rounded-full ${getStatusBadge(tech.status)}`}>
                          {tech.status}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{tech.desc}</p>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Architecture Stack Component */}
      <section aria-labelledby="architecture-stack-heading" className="bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-black/90 border border-slate-800 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-2">System Architecture Blueprint</span>
          <h2 id="architecture-stack-heading" className="text-2xl md:text-4xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Architecture Stack
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl mx-auto font-light leading-relaxed">
            Interactive multi-tier layout. Click any layer below to highlight matching ecosystem modules.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {architectureLayers.map((layer) => {
            const isSelected = selectedLayer === layer.catKey;

            return (
              <motion.div 
                key={layer.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Toggle filter for ${layer.name}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedLayer(isSelected ? null : layer.catKey)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer(isSelected ? null : layer.catKey);
                  }
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-slate-950 border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.4)] font-bold' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/40 hover:text-white shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                      isSelected ? 'bg-black text-cyan-300 border-black' : 'bg-slate-950 text-cyan-400 border-slate-800'
                    }`} aria-hidden="true">
                      {layer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold font-['Space_Grotesk'] text-base md:text-lg ${isSelected ? 'text-black' : 'text-white'}`}>
                          {layer.name}
                        </h3>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          isSelected 
                            ? 'bg-black/20 text-black border-black/20 font-bold' 
                            : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {layer.title}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 font-light ${isSelected ? 'text-slate-950 font-medium' : 'text-slate-300'}`}>
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {layer.techs.map(t => (
                      <span 
                        key={t}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                          isSelected 
                            ? 'bg-black text-white border-black font-medium shadow-sm' 
                            : 'bg-black/70 text-slate-300 border-slate-800'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Ecosystem;
