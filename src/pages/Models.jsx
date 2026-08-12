import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import ModelsHeader from '../components/models/ModelsHeader';
import ComparisonMatrix from '../components/models/ComparisonMatrix';
import ModelCard from '../components/models/ModelCard';
import DownloadModal from '../components/models/DownloadModal';

const Models = () => {
  const [models, setModels] = useState([]);
  
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
        if (data.results && data.results.length > 0) {
          const backendModels = data.results.map(m => ({
            name: m.name,
            params: m.parameters_count || 'N/A',
            context: 'Unknown', 
            type: m.architecture,
            precision: 'Unknown',
            scores: m.metrics || { mmlu: '-', math: '-', gsm8k: '-' },
            size: 'Unknown',
            memory: 'Unknown'
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
    setSpeedData(Array.from({length: 10}, (_, i) => ({ time: i, speed: 0 })));
  };

  useEffect(() => {
    let interval;
    if (downloadModal && progress < 100) {
      interval = setInterval(() => {
        const newSpeed = 20 + Math.random() * 50;
        setProgress(p => {
          const next = p + (newSpeed / 100);
          return next > 100 ? 100 : next;
        });
        setSpeedData(prev => {
          const newData = [...prev.slice(1), { time: Date.now(), speed: newSpeed }];
          return newData;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [downloadModal, progress]);

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="models-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative">
      <ModelsHeader />

      <ComparisonMatrix models={models} onDownload={handleDownload} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {models.map((model, i) => (
          <ModelCard 
            key={model.name} 
            model={model} 
            index={i} 
            onDownload={handleDownload} 
          />
        ))}
      </div>

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
