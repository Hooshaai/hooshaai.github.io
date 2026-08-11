import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const Models = () => {
  const models = [
    { name: 'Hoosha CFM-7B', params: '7B', context: '32k', type: 'Flow Matching', precision: 'BF16', scores: { mmlu: 68.2, math: 42.1, gsm8k: 78.5 }, size: '14.2 GB', memory: '16 GB' },
    { name: 'GRPO Reasoner 14B', params: '14B', context: '128k', type: 'Reasoning', precision: 'INT4', scores: { mmlu: 75.4, math: 61.2, gsm8k: 89.1 }, size: '8.4 GB', memory: '12 GB' },
    { name: 'Sparse MoE 8x7B', params: '47B', context: '64k', type: 'MoE', precision: 'FP8', scores: { mmlu: 72.1, math: 51.4, gsm8k: 84.3 }, size: '47.1 GB', memory: '48 GB' },
    { name: 'Adaptive RAG 3B', params: '3B', context: '8k', type: 'RAG', precision: 'BF16', scores: { mmlu: 61.5, math: 31.2, gsm8k: 65.4 }, size: '6.1 GB', memory: '8 GB' },
    { name: 'Vision Flow 34B', params: '34B', context: '128k', type: 'Multimodal', precision: 'FP8', scores: { mmlu: 78.9, math: 65.4, gsm8k: 91.2 }, size: '34.5 GB', memory: '40 GB' },
    { name: 'Triton Kernel v1', params: 'N/A', context: 'N/A', type: 'Kernel', precision: 'CUDA', scores: { mmlu: '-', math: '-', gsm8k: '-' }, size: '2 MB', memory: '1 GB' }
  ];

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
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-6">Model Zoo</h1>
        <div className="flex flex-wrap justify-center gap-8 text-gray-400 font-mono text-sm bg-gray-900/50 inline-flex p-4 rounded-2xl border border-gray-800">
          <span className="flex items-center"><i className="fas fa-database text-cyan-400 mr-3 text-lg"></i>144.2 GB Total Repository</span>
          <span className="flex items-center"><i className="fas fa-cube text-purple-400 mr-3 text-lg"></i>6 Production Checkpoints</span>
          <span className="flex items-center"><i className="fas fa-download text-green-400 mr-3 text-lg"></i>276k+ Global Downloads</span>
        </div>
      </div>

      <div className="mb-16 overflow-x-auto">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Comparison Matrix</h2>
        <table className="w-full text-left border-collapse font-mono text-sm">
          <thead>
            <tr className="bg-gray-900/80 border-b border-gray-800 text-gray-400">
              <th className="p-4">Model Name</th>
              <th className="p-4">Parameters</th>
              <th className="p-4">Context Length</th>
              <th className="p-4">Memory Footprint</th>
              <th className="p-4">MMLU</th>
              <th className="p-4">MATH500</th>
              <th className="p-4">GSM8K</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                <td className="p-4 font-bold text-cyan-400">{model.name}</td>
                <td className="p-4">{model.params}</td>
                <td className="p-4">{model.context}</td>
                <td className="p-4">{model.memory}</td>
                <td className="p-4">{model.scores.mmlu}</td>
                <td className="p-4">{model.scores.math}</td>
                <td className="p-4">{model.scores.gsm8k}</td>
                <td className="p-4">
                  <button onClick={() => handleDownload(model)} className="px-3 py-1 bg-gray-800 hover:bg-cyan-500 hover:text-black rounded text-xs transition-colors">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-3xl w-full relative shadow-2xl"
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
                  <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                    Size: {downloadModal.size} • <span className="text-green-400"><i className="fas fa-check-circle"></i> SHA256 Verified</span>
                  </p>
                </div>
              </div>
              
              <div className="mb-8 bg-black/50 p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-cyan-400">{progress >= 100 ? 'Download Complete' : 'Downloading weights (.safetensors)...'}</span>
                  <span className="text-white">{Math.min(100, Math.floor(progress))}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full relative" 
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="h-20 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={speedData}>
                      <YAxis domain={[0, 100]} hide />
                      <Line type="monotone" dataKey="speed" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {progress < 100 && <div className="text-right text-xs text-gray-500 mt-2 font-mono">{(speedData[speedData.length-1]?.speed || 0).toFixed(1)} MB/s</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-mono">Wget</span>
                    <button onClick={() => copyCode(`wget https://huggingface.co/hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors`, 'wget')} className="text-xs text-cyan-400 hover:text-white">
                      {copied === 'wget' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
                    </button>
                  </div>
                  <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-xs text-green-400 overflow-x-auto h-24 flex items-center">
                    wget https://huggingface.co/hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}/resolve/main/model.safetensors
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-mono">Hugging Face CLI</span>
                    <button onClick={() => copyCode(`huggingface-cli download hooshaai/${downloadModal.name.replace(/ /g, '-').toLowerCase()}`, 'hf')} className="text-xs text-cyan-400 hover:text-white">
                      {copied === 'hf' ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
                    </button>
                  </div>
                  <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-xs text-purple-400 overflow-x-auto h-24 flex items-center">
                    huggingface-cli download hooshaai/{downloadModal.name.replace(/ /g, '-').toLowerCase()}
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
