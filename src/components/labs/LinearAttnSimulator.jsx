import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, HardDrive } from 'lucide-react';
import { MathBlock } from '../../utils/renderMath';

const LinearAttnSimulator = () => {
  const [seqLength, setSeqLength] = useState(16384);
  const [dModel, setDModel] = useState(4096);
  const [batchSize, setBatchSize] = useState(4);
  const [precision, setPrecision] = useState(2); // 2 bytes for FP16/BF16

  // Calculation metrics
  const stats = useMemo(() => {
    // Softmax Attention O(N^2)
    // Memory for QK^T matrix: B * H * N * N * precision bytes
    const numHeads = 32;
    const softmaxMatrixBytes = batchSize * numHeads * seqLength * seqLength * precision;
    const softmaxVramGB = (softmaxMatrixBytes / (1024 * 1024 * 1024)).toFixed(2);
    const softmaxFlops = (2 * batchSize * numHeads * seqLength * seqLength * (dModel / numHeads) / 1e12).toFixed(2);

    // Linear Attention O(N)
    // State memory: B * H * d_head * d_head * precision
    const dHead = dModel / numHeads;
    const linearStateBytes = batchSize * numHeads * dHead * dHead * precision + (batchSize * seqLength * dModel * precision);
    const linearVramGB = (linearStateBytes / (1024 * 1024 * 1024)).toFixed(2);
    const linearFlops = (2 * batchSize * seqLength * dModel * dHead / 1e12).toFixed(2);

    const vramSavedRatio = (softmaxVramGB / Math.max(0.01, parseFloat(linearVramGB))).toFixed(1);

    return {
      softmaxVramGB,
      softmaxFlops,
      linearVramGB,
      linearFlops,
      vramSavedRatio
    };
  }, [seqLength, dModel, batchSize, precision]);

  const presets = [
    { label: '4k Tokens', seq: 4096 },
    { label: '16k Tokens', seq: 16384 },
    { label: '64k Tokens', seq: 65536 },
    { label: '128k Ultra-Long', seq: 131072 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 border border-cyan-500/25 rounded-3xl p-6 sm:p-8 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-12 relative overflow-hidden group"
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider">05 / SIMULATOR</span>
            <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
              Linear Attention O(N) vs Softmax O(N²)
            </span>
          </div>
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Sub-Quadratic Sequence Scaling Simulator
          </h3>
        </div>

        {/* Live VRAM Efficiency Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-cyan-500/20 px-4 py-2 rounded-2xl font-mono text-xs text-gray-300 shadow-inner">
          <div>
            <span className="text-gray-500 block text-[10px]">VRAM SAVINGS</span>
            <span className="text-cyan-400 font-bold text-base">{stats.vramSavedRatio}x</span>
          </div>
          <div className="h-6 w-px bg-cyan-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">LINEAR VRAM</span>
            <span className="text-emerald-400 font-bold">{stats.linearVramGB} GB</span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light">
        Standard Softmax self-attention requires storing an $N \times N$ matrix, creating an $O(N^2)$ VRAM wall. Linear Attention computes $\phi(Q)(\phi(K)^T V)$ in associative recurrent state format, reducing computational scaling to $O(N)$.
      </p>

      <MathBlock formula={String.raw`\text{Softmax: } \text{Attn}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V, \quad \text{Linear: } \text{Attn}(Q,K,V) = \frac{\phi(Q)\left(\sum_i \phi(K_i)^T V_i\right)}{\phi(Q)\sum_i \phi(K_i)^T}`} />

      {/* Control Sliders Bar */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-5 mb-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Presets & Sequence Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-gray-300">
            <span className="font-semibold text-cyan-400">SEQUENCE LENGTH (N):</span>
            <span className="text-white font-bold">{seqLength.toLocaleString()} tokens</span>
          </div>
          <input
            type="range"
            min="1024"
            max="131072"
            step="1024"
            value={seqLength}
            onChange={(e) => setSeqLength(parseInt(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex gap-1.5 pt-1">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSeqLength(p.seq)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  seqLength === p.seq
                    ? 'bg-cyan-400 text-black font-bold'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Dimension Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-gray-300">
            <span className="font-semibold text-cyan-400">MODEL DIMENSION (d_model):</span>
            <span className="text-white font-bold">{dModel}</span>
          </div>
          <input
            type="range"
            min="1024"
            max="8192"
            step="1024"
            value={dModel}
            onChange={(e) => setDModel(parseInt(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[10px] font-mono text-gray-500 block">
            Hidden dimension (d_head = {dModel / 32})
          </span>
        </div>

        {/* Batch Size & Precision */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-gray-300">
            <span className="font-semibold text-cyan-400">BATCH SIZE & PRECISION:</span>
            <span className="text-white font-bold">B={batchSize}, {precision === 2 ? 'FP16' : 'FP8'}</span>
          </div>
          <div className="flex gap-2">
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-cyan-400"
            >
              <option value={1}>Batch 1</option>
              <option value={4}>Batch 4</option>
              <option value={16}>Batch 16</option>
              <option value={32}>Batch 32</option>
            </select>
            <select
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-cyan-400"
            >
              <option value={2}>FP16 / BF16 (16-bit)</option>
              <option value={1}>FP8 (8-bit)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Softmax Card */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-red-400" />
              <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">Softmax Self-Attention O(N²)</h4>
            </div>
            <span className="text-xs font-mono bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full border border-red-500/30">
              Quadratic Bottleneck
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-gray-400 mb-1">
                <span>VRAM Memory Allocated:</span>
                <span className="text-red-400 font-bold text-sm">{stats.softmaxVramGB} GB</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-red-500/20">
                <div 
                  className="bg-gradient-to-r from-red-500 to-rose-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (parseFloat(stats.softmaxVramGB) / 120) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between border-t border-red-500/20 pt-3 text-gray-300">
              <span>Attention Matrix FLOPs:</span>
              <span className="text-white font-bold">{stats.softmaxFlops} TFLOPs</span>
            </div>
          </div>
        </div>

        {/* Linear Attention Card */}
        <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">Hoosha Linear Attention O(N)</h4>
            </div>
            <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/40 font-bold">
              Sub-Quadratic Scaling
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-gray-400 mb-1">
                <span>VRAM Memory Allocated:</span>
                <span className="text-cyan-300 font-bold text-sm">{stats.linearVramGB} GB</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-cyan-500/30">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_#00f0ff]" 
                  style={{ width: `${Math.max(4, Math.min(100, (parseFloat(stats.linearVramGB) / 120) * 100))}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between border-t border-cyan-500/20 pt-3 text-gray-300">
              <span>Recurrent State FLOPs:</span>
              <span className="text-emerald-400 font-bold">{stats.linearFlops} TFLOPs</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LinearAttnSimulator;
