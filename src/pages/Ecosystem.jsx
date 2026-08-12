import { useState, useMemo } from 'react';
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

  return (
    <div className="ecosystem-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative">
      <SEO 
        title="Tech Ecosystem"
        description="Explore the compute infrastructure, custom CUDA/Triton kernels, framework integrations, and academic HPC partnerships powering Hoosha AI."
        keywords="PyTorch, CUDA, Triton Kernels, HPC Clusters, High Performance Computing, Deep Learning Infrastructure"
      />

      {/* Page Header */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 mb-4">
          <i className="fas fa-network-wired text-emerald-400" aria-hidden="true"></i>
          <span>Open Research Ecosystem</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight text-white">
          Tech Ecosystem
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light">
          The compute infrastructure, custom kernels, frameworks, and academic partnerships powering Hoosha AI's research platform.
        </p>
      </header>

      {/* Controls Bar: Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/[0.02] p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
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
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md font-bold' 
                    : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-gray-300'
                }`}>
                  {tabCounts[tab] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <label htmlFor="ecosystem-search-input" className="sr-only">Search tech stack and tools</label>
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true"></i>
          <input 
            id="ecosystem-search-input"
            type="text"
            placeholder="Search stack & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>

      {/* Layer Reset Indicator */}
      {selectedLayer && (
        <div role="status" className="mb-6 flex items-center justify-between bg-blue-500/10 border border-blue-500/30 px-4 py-2.5 rounded-2xl text-xs text-blue-300 font-mono">
          <span className="flex items-center gap-2">
            <i className="fas fa-layer-group" aria-hidden="true"></i> Filtered by Architecture Layer: <strong className="text-white">{selectedLayer} Layer</strong>
          </span>
          <button 
            onClick={() => setSelectedLayer(null)}
            className="hover:text-white font-bold underline cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
          >
            Clear Layer Filter
          </button>
        </div>
      )}

      {/* Tech Stack Grid */}
      <section aria-label="Ecosystem Components Grid">
        {filteredTech.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 text-center text-gray-300 mb-20" role="status">
            <i className="fas fa-search text-3xl text-gray-500 mb-3 block" aria-hidden="true"></i>
            <h2 className="text-lg font-bold text-white mb-1">No ecosystem components found</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4 font-light">Try clearing your search query or switching active tab filter.</p>
            <button 
              onClick={() => { setActiveTab('All'); setSearchQuery(''); setSelectedLayer(null); }}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl text-xs font-bold transition-all border border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {filteredTech.map(tech => (
              <article 
                key={tech.name} 
                className="group bg-white/[0.03] p-7 border border-white/15 hover:border-white/40 hover:bg-white/[0.06] transition-all duration-300 rounded-3xl flex flex-col items-center text-center shadow-xl backdrop-blur-sm relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 text-white shadow-inner" aria-hidden="true">
                  <i className={`fas ${tech.icon || 'fa-cube'} text-2xl text-white opacity-90`}></i>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-white mb-1">{tech.name}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-mono tracking-widest text-gray-200 uppercase border border-white/15 px-2 py-0.5 rounded-full bg-white/5">
                    {tech.cat}
                  </span>
                  {tech.tag && (
                    <span className="text-[9px] font-mono tracking-wider text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/10">
                      {tech.tag}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed font-light">{tech.desc}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Architecture Stack Component */}
      <section aria-labelledby="architecture-stack-heading" className="bg-white/[0.03] border border-white/20 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold block mb-2">System Blueprint</span>
          <h2 id="architecture-stack-heading" className="text-2xl md:text-4xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Architecture Stack
          </h2>
          <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl mx-auto font-light">
            Interactive multi-tier layout. Click any layer below to highlight matching ecosystem modules.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {architectureLayers.map((layer) => {
            const isSelected = selectedLayer === layer.catKey;

            return (
              <div 
                key={layer.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Toggle filter for ${layer.name}`}
                onClick={() => setSelectedLayer(isSelected ? null : layer.catKey)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLayer(isSelected ? null : layer.catKey);
                  }
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-xl scale-[1.01]' 
                    : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                      isSelected ? 'bg-black text-white border-black' : 'bg-white/10 text-white border-white/20'
                    }`} aria-hidden="true">
                      {layer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold font-['Space_Grotesk'] text-base md:text-lg ${isSelected ? 'text-black' : 'text-white'}`}>
                          {layer.name}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-black/10 text-black font-semibold' : 'bg-white/10 text-gray-300'
                        }`}>
                          {layer.title}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 font-light ${isSelected ? 'text-gray-900' : 'text-gray-300'}`}>
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
                            ? 'bg-black text-white border-black font-medium' 
                            : 'bg-black/40 text-gray-200 border-white/10'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Ecosystem;
