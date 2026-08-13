import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import ModelsHeader from '../components/models/ModelsHeader';
import ComparisonMatrix from '../components/models/ComparisonMatrix';
import ModelCard from '../components/models/ModelCard';
import DownloadModal from '../components/models/DownloadModal';
import SEO from '../components/common/SEO';

const Models = () => {
  const [models, setModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  useEffect(() => {
    const defaultModels = [
      { name: 'Hoosha CFM-7B', params: '7B', context: '32k', type: 'Flow Matching', precision: 'BF16', scores: { mmlu: 68.2, math: 42.1, gsm8k: 78.5 }, size: '14.2 GB', memory: '16 GB' },
      { name: 'GRPO Reasoner 14B', params: '14B', context: '128k', type: 'Reasoning', precision: 'INT4', scores: { mmlu: 75.4, math: 61.2, gsm8k: 89.1 }, size: '8.4 GB', memory: '12 GB' },
      { name: 'Sparse MoE 8x7B', params: '47B', context: '64k', type: 'MoE', precision: 'FP8', scores: { mmlu: 72.1, math: 51.4, gsm8k: 84.3 }, size: '47.1 GB', memory: '48 GB' },
      { name: 'Adaptive RAG 3B', params: '3B', context: '8k', type: 'RAG', precision: 'BF16', scores: { mmlu: 61.5, math: 31.2, gsm8k: 65.4 }, size: '6.1 GB', memory: '8 GB' },
      { name: 'Vision Flow 34B', params: '34B', context: '128k', type: 'Multimodal', precision: 'FP8', scores: { mmlu: 78.9, math: 65.4, gsm8k: 91.2 }, size: '34.5 GB', memory: '40 GB' },
      { name: 'Triton Kernel v1', params: 'N/A', context: 'N/A', type: 'Kernel', precision: 'CUDA', scores: { mmlu: '-', math: '-', gsm8k: '-' }, size: '2 MB', memory: '1 GB' }
    ];

    apiFetch('/api/v1/checkpoints/')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
          const backendModels = data.results.map(m => ({
            name: m.name || 'Unnamed Checkpoint',
            params: m.parameters_count || m.params || 'N/A',
            context: m.context_length || m.context || 'Unknown', 
            type: m.architecture || m.type || 'General',
            precision: m.precision || 'BF16',
            scores: {
              mmlu: m.metrics?.mmlu ?? m.scores?.mmlu ?? '-',
              math: m.metrics?.math ?? m.scores?.math ?? '-',
              gsm8k: m.metrics?.gsm8k ?? m.scores?.gsm8k ?? '-'
            },
            size: m.file_size || m.size || 'Unknown',
            memory: m.min_vram || m.memory || 'Unknown'
          }));
          setModels(backendModels);
        } else {
          setModels(defaultModels);
        }
      })
      .catch(() => setModels(defaultModels));
  }, []);

  const [downloadModal, setDownloadModal] = useState(null);
  const [progress, setProgress] = useState(0);
  const [speedData, setSpeedData] = useState([]);
  const [copied, setCopied] = useState('');

  const handleDownload = (model) => {
    setDownloadModal(model);
    setProgress(0);
    setCopied('');
    setSpeedData(Array.from({ length: 10 }, (_, i) => ({ time: i, speed: 0 })));
  };

  useEffect(() => {
    let interval;
    if (downloadModal && progress < 100) {
      interval = setInterval(() => {
        const newSpeed = 25 + Math.random() * 45;
        setProgress(p => {
          const next = p + (newSpeed / 100);
          return next >= 100 ? 100 : next;
        });
        setSpeedData(prev => {
          const newData = [...prev.slice(1), { time: Date.now(), speed: newSpeed }];
          return newData;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [downloadModal, progress]);

  const copyCode = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopied(id);
    setTimeout(() => setCopied(''), 2500);
  };

  // Types filter list
  const availableTypes = useMemo(() => {
    const typesSet = new Set(['All']);
    models.forEach(m => {
      if (m?.type) typesSet.add(m.type);
    });
    return Array.from(typesSet);
  }, [models]);

  // Filtered models for grid view
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      const matchesType = selectedType === 'All' || m?.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (m?.name || '').toLowerCase().includes(q) || 
        (m?.type || '').toLowerCase().includes(q) ||
        (m?.params || '').toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [models, selectedType, searchQuery]);

  return (
    <div className="models-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative min-h-screen">
      {/* Ambient background lighting */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <SEO 
        title="Model Checkpoints & Weights"
        description="Browse, benchmark, and download open-weights .safetensors checkpoints for Hoosha AI models including CFM-7B, GRPO Reasoner, and MoE architectures."
        keywords="Safetensors, Open Weights, Model Checkpoints, GRPO Reasoner, Continuous Flow Matching Weights, HuggingFace Models"
      />

      <ModelsHeader 
        totalModels={models.length} 
        totalSize="110.3 GB" 
        totalDownloads="276k+" 
      />

      <ComparisonMatrix models={models} onDownload={handleDownload} />

      {/* Grid Header & Filters */}
      <section aria-labelledby="checkpoint-repository-heading" className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="checkpoint-repository-heading" className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-2">
              <span className="text-cyan-400">📦</span> Checkpoint Repository
            </h2>
            <p className="text-xs text-gray-400 font-light mt-1">
              Browse weights, quantizations, and specialized architecture variants.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <label htmlFor="models-search-input" className="sr-only">Search checkpoints by name or type</label>
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60 text-xs" aria-hidden="true"></i>
            <input 
              id="models-search-input"
              type="text" 
              placeholder="Search checkpoints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded cursor-pointer"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div role="tablist" aria-label="Architecture Filter" className="flex flex-wrap gap-2">
          {availableTypes.map(t => {
            const isSelected = selectedType === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isSelected 
                    ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                    : 'bg-slate-900/60 border-cyan-500/20 text-gray-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* Model Cards Grid */}
      <section aria-label="Model Checkpoints Grid">
        {filteredModels.length === 0 ? (
          <div role="status" className="bg-slate-950/70 border border-cyan-500/20 rounded-3xl p-12 text-center text-gray-300 mb-12 backdrop-blur-xl">
            <i className="fas fa-box-open text-3xl text-cyan-500/40 mb-3 block" aria-hidden="true"></i>
            <h3 className="text-lg font-bold text-white mb-1">No Checkpoints Match Your Filter</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4 font-light">Try resetting search query or switching architecture filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-400 text-cyan-300 hover:text-black rounded-xl text-xs font-mono font-bold transition-all border border-cyan-500/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredModels.map((model, i) => (
              <ModelCard 
                key={model.name || i} 
                model={model} 
                index={i} 
                onDownload={handleDownload} 
              />
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {downloadModal && (
          <DownloadModal 
            downloadModal={downloadModal} 
            onClose={() => setDownloadModal(null)} 
            progress={progress} 
            speedData={speedData} 
            copied={copied} 
            onCopyCode={copyCode} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Models;

