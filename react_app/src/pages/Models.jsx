import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Models = () => {
  const models = [
    { name: 'Hoosha CFM-7B', params: '7B', type: 'Flow Matching', precision: 'BF16', scores: { mmlu: 68.2, math: 42.1, gsm8k: 78.5 }, size: '14.2 GB' },
    { name: 'GRPO Reasoner 14B', params: '14B', type: 'Reasoning', precision: 'INT4', scores: { mmlu: 75.4, math: 61.2, gsm8k: 89.1 }, size: '8.4 GB' },
    { name: 'Sparse MoE 8x7B', params: '47B', type: 'MoE', precision: 'FP8', scores: { mmlu: 72.1, math: 51.4, gsm8k: 84.3 }, size: '47.1 GB' },
    { name: 'Adaptive RAG 3B', params: '3B', type: 'RAG', precision: 'BF16', scores: { mmlu: 61.5, math: 31.2, gsm8k: 65.4 }, size: '6.1 GB' },
    { name: 'Vision Flow 34B', params: '34B', type: 'Multimodal', precision: 'FP8', scores: { mmlu: 78.9, math: 65.4, gsm8k: 91.2 }, size: '34.5 GB' },
    { name: 'Triton Kernel v1', params: 'N/A', type: 'Kernel', precision: 'CUDA', scores: { mmlu: '-', math: '-', gsm8k: '-' }, size: '2 MB' }
  ];

  const [downloadModal, setDownloadModal] = useState(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState('');

  const handleDownload = (model) => {
    setDownloadModal(model);
    setProgress(0);
    setCopied('');
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + (Math.random() * 15); // Random jumps
      });
    }, 500);
  };

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="models-page pt-32 px-4 max-w-7xl mx-auto mb-20 relative">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-6">Model Zoo</h1>
        <div className="flex flex-wrap justify-center gap-8 text-gray-400 font-mono text-sm bg-gray-900/50 inline-flex p-4 rounded-2xl border border-gray-800">
          <span className="flex items-center"><i className="fas fa-database text-cyan-400 mr-3 text-lg"></i>144.2 GB Total Repository</span>
          <span className="flex items-center"><i className="fas fa-cube text-purple-400 mr-3 text-lg"></i>6 Production Checkpoints</span>
          <span className="flex items-center"><i className="fas fa-download text-green-400 mr-3 text-lg"></i>276k+ Global Downloads</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={model.name} 
            className="glass-card card p-6 rounded-2xl border border-gray-800 flex flex-col hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold font-['Space_Grotesk'] group-hover:text-cyan-400 transition-colors">{model.name}</h3>
              <span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700 text-gray-300 font-mono">{model.precision}</span>
            </div>
            <div className="text-sm text-cyan-400 mb-6 font-mono flex items-center justify-between">
              <span>{model.type} • {model.params}</span>
              <span className="text-gray-500"><i className="fas fa-hdd mr-1"></i> {model.size}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-8 text-center text-xs">
              <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-lg">
                <div className="text-gray-500 mb-1">MMLU</div>
                <div className="font-mono text-white text-sm">{model.scores.mmlu}</div>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-lg">
                <div className="text-gray-500 mb-1">MATH500</div>
                <div className="font-mono text-white text-sm">{model.scores.math}</div>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 p-3 rounded-lg">
                <div className="text-gray-500 mb-1">GSM8K</div>
                <div className="font-mono text-white text-sm">{model.scores.gsm8k}</div>
              </div>
            </div>

            <button 
              className="mt-auto w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors flex justify-center items-center gap-2"
              onClick={() => handleDownload(model)}
            >
              <i className="fas fa-download"></i> Get Weights
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {downloadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl"
            >
              <button 
                className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center"
                onClick={() => setDownloadModal(null)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-900/30 rounded-xl border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-2xl">
                  <i className="fas fa-cube"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-['Space_Grotesk']">{downloadModal.name}</h2>
                  <p className="text-sm text-gray-400 font-mono">Size: {downloadModal.size} • SHA256: 8f4e2...a1b9</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-cyan-400">{progress >= 100 ? 'Download Complete' : 'Downloading weights...'}</span>
                  <span className="text-white">{Math.min(100, Math.floor(progress))}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full relative" 
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                {progress < 100 && <div className="text-right text-xs text-gray-500 mt-2 font-mono">ETA: {Math.floor(120 - progress)}s • 45 MB/s</div>}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-mono">Wget Command</span>
                    <button onClick={() => copyCode(`wget https://huggingface.co/hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors`, 'wget')} className="text-xs text-cyan-400 hover:text-white">
                      {copied === 'wget' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
                    </button>
                  </div>
                  <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-sm text-green-400 overflow-x-auto">
                    wget https://huggingface.co/hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-mono">PyTorch Implementation</span>
                    <button onClick={() => copyCode(`import torch\\nfrom transformers import AutoModelForCausalLM\\n\\nmodel = AutoModelForCausalLM.from_pretrained(\\n  "hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}",\\n  torch_dtype=torch.bfloat16\\n)`, 'pt')} className="text-xs text-cyan-400 hover:text-white">
                      {copied === 'pt' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
                    </button>
                  </div>
                  <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">
<span className="text-purple-400">import</span> torch
<span className="text-purple-400">from</span> transformers <span className="text-purple-400">import</span> AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
  <span className="text-yellow-300">"hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}"</span>,
  torch_dtype=torch.bfloat16
)
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Models;
