import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import ModelsHeader from '../components/models/ModelsHeader';
import ComparisonMatrix from '../components/models/ComparisonMatrix';
import ModelCard from '../components/models/ModelCard';
import DownloadModal from '../components/models/DownloadModal';

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
    <div className="models-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative">
      <ModelsHeader 
        totalModels={models.length} 
        totalSize="110.3 GB" 
        totalDownloads="276k+" 
      />

      <ComparisonMatrix models={models} onDownload={handleDownload} />

      {/* Grid Header & Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Checkpoint Repository
            </h2>
            <p className="text-sm text-gray-400 font-light mt-1">
              Browse weights, quantizations, and specialized architecture variants.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search checkpoints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/50 font-mono transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {availableTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                selectedType === t 
                  ? 'bg-white text-black border-white shadow' 
                  : 'bg-white/5 border-white/15 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      {filteredModels.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 text-center text-gray-400 mb-12">
          <i className="fas fa-box-open text-3xl text-gray-600 mb-3 block"></i>
          <h3 className="text-lg font-bold text-white mb-1">No Checkpoints Match Your Filter</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">Try resetting search query or switching architecture filter.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl text-xs font-bold transition-all border border-white/20"
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
