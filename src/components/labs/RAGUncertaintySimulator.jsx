import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldAlert, Sparkles, Sliders, Trash2, Info, Terminal } from 'lucide-react';
import { MathBlock } from '../../utils/renderMath';

// Preset prompts demonstration
const PRESETS = [
  { label: 'Low Uncertainty', text: 'The capital of France is Paris and it is known for the Eiffel Tower.' },
  { label: 'High Tech Term', text: 'Quantum chromodynamics predicts glueball bound states at 1.5 GeV energy levels.' },
  { label: 'Hallucination Risk', text: 'In 1842, the secret treaty of Oakhaven was signed by Lord Ravenscroft.' },
  { label: 'Ambiguous Query', text: 'What was the exact net worth of the founder cousin in 1994?' }
];

// Deterministic token entropy calculator based on word characteristics
function calculateWordEntropy(word) {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return 0.1;

  // Common low-uncertainty stopwords
  const stopwords = new Set(['the', 'is', 'at', 'which', 'on', 'in', 'of', 'and', 'a', 'to', 'for', 'was', 'by', 'it']);
  if (stopwords.has(clean)) {
    return 0.12 + (clean.length * 0.02);
  }

  // Technical / Rare words get higher entropy
  const techTerms = new Set(['chromodynamics', 'glueball', 'oakhaven', 'ravenscroft', 'founder', 'treaty', 'quantum', 'net']);
  if (techTerms.has(clean)) {
    return 0.85 + (clean.length * 0.03);
  }

  // Fallback hash-based deterministic entropy calculation
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const normHash = Math.abs(hash % 1000) / 1000;
  return Math.min(1.2, Math.max(0.15, 0.25 + normHash * 0.75));
}

const RAGUncertaintySimulator = () => {
  const [prompt, setPrompt] = useState(PRESETS[1].text);
  const [threshold, setThreshold] = useState(0.65);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(null);
  const [stats, setStats] = useState({ conf: '0.0', meanEnt: '0.00', trig: false });
  const [logs, setLogs] = useState([]);
  const canvasRef = useRef(null);

  const words = useMemo(() => prompt.trim().split(/\s+/).filter(w => w.length > 0), [prompt]);

  // Compute deterministic entropy data for each token
  const entropyData = useMemo(() => {
    return words.map((word) => {
      const ent = calculateWordEntropy(word);
      const conf = Math.max(5, Math.min(99, (1 - ent / 1.3) * 100));
      return { word, ent, conf };
    });
  }, [words]);

  // Update statistics & logs
  useEffect(() => {
    if (entropyData.length === 0) {
      setStats({ conf: '100.0', meanEnt: '0.00', trig: false });
      return;
    }

    const meanEnt = entropyData.reduce((a, b) => a + b.ent, 0) / entropyData.length;
    const isTrig = meanEnt > threshold;
    const avgConf = Math.max(0, (1 - (meanEnt / 1.3)) * 100).toFixed(1);

    setStats({
      conf: avgConf,
      meanEnt: meanEnt.toFixed(2),
      trig: isTrig
    });

    if (isTrig) {
      const msg = `[${new Date().toLocaleTimeString()}] RAG Gate Triggered: Mean Entropy (${meanEnt.toFixed(2)}) > τ (${threshold.toFixed(2)})`;
      setLogs((l) => {
        if (l.length > 0 && l[0].includes(`Mean Entropy (${meanEnt.toFixed(2)})`)) return l;
        return [msg, ...l].slice(0, 6);
      });
    }
  }, [entropyData, threshold]);

  // Render Entropy Spectrum Canvas Bar Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    if (entropyData.length === 0) return;

    const barWidth = Math.max(10, (w - 40) / entropyData.length - 6);
    const spacing = 6;
    const maxH = h - 50;

    // Draw Threshold Line (tau)
    const tauY = (h - 30) - (threshold * maxH / 1.2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(10, tauY);
    ctx.lineTo(w - 10, tauY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = '10px monospace';
    ctx.fillText(`THRESHOLD τ (${threshold.toFixed(2)})`, w - 130, Math.max(12, tauY - 4));

    // Draw Bars
    entropyData.forEach((d, i) => {
      const barH = (d.ent / 1.2) * maxH;
      const x = 20 + i * (barWidth + spacing);
      const y = (h - 30) - barH;

      const isExceeded = d.ent > threshold;
      ctx.fillStyle = isExceeded ? '#ef4444' : d.ent > 0.4 ? '#f59e0b' : '#10b981';

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Token text preview underneath
      ctx.fillStyle = '#71717a';
      ctx.font = '9px monospace';
      const label = d.word.length > 5 ? d.word.slice(0, 4) + '…' : d.word;
      ctx.fillText(label, x, h - 14);
    });
  }, [entropyData, threshold]);

  return (
    <motion.div
      id="rag-lab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 hover:border-zinc-700/80 transition-all duration-300 shadow-2xl backdrop-blur-xl mb-12"
    >
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-400 font-mono text-sm font-semibold">04 / SIMULATOR</span>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
              Epistemic Uncertainty & RAG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            LLM Epistemic Uncertainty & RAG Gate
          </h2>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-2xl font-mono text-xs text-zinc-400">
          <div>
            <span className="text-zinc-500 block text-[10px]">AVG CONFIDENCE</span>
            <span className="text-emerald-400 font-bold">{stats.conf}%</span>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <span className="text-zinc-500 block text-[10px]">MEAN ENTROPY (H)</span>
            <span className="text-white font-bold">{stats.meanEnt}</span>
          </div>
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-4 leading-relaxed font-light">
        Epistemic uncertainty calculates token entropy H(X). When average token entropy exceeds threshold &tau;, the system halts parametric generation and triggers external Knowledge Base RAG retrieval.
      </p>

      {/* KaTeX Math Formula */}
      <MathBlock formula={String.raw`\mathcal{H}(X) = -\sum_i p_i \log p_i, \quad \text{RAG Gate Trigger: } \mathbb{1}[\mathcal{H} > \tau]`} />

      {/* Presets & Controls */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Preset Prompt Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-zinc-500 mr-1">PRESETS:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.text);
                setSelectedTokenIndex(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Threshold Slider */}
        <div className="font-mono text-xs w-full md:w-64">
          <div className="flex justify-between text-zinc-400 mb-1">
            <label htmlFor="threshold-slider">THRESHOLD (τ):</label>
            <span className="text-white font-bold">{threshold.toFixed(2)}</span>
          </div>
          <input
            id="threshold-slider"
            type="range"
            min="0.30"
            max="0.90"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Text Area & Trigger Banner */}
      <div className="relative mb-4">
        <label htmlFor="prompt-input" className="sr-only">Prompt Input</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type or paste any query prompt..."
          className="w-full h-24 bg-black border border-zinc-800 rounded-2xl p-4 text-white font-sans text-sm sm:text-base focus:outline-none focus:border-zinc-600 transition-all resize-none"
        />

        {stats.trig ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 bg-red-500 text-white font-mono text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg animate-pulse"
          >
            <Database className="w-3.5 h-3.5" />
            RAG RETRIEVAL TRIGGERED
          </motion.div>
        ) : (
          <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Parametric Response Active
          </div>
        )}
      </div>

      {/* Token Entropy Heatmap Spectrum */}
      <div className="mb-4">
        <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
          <span>TOKEN ENTROPY HEATMAP (Click Token for Details):</span>
          <div className="flex gap-3 text-[10px]">
            <span className="text-emerald-400">■ Low Entropy (&lt;0.4)</span>
            <span className="text-amber-400">■ Medium (0.4-τ)</span>
            <span className="text-red-400">■ High (&gt;τ Trigger)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-black border border-zinc-800 min-h-[90px]">
          {entropyData.map((d, i) => {
            const isExceeded = d.ent > threshold;
            const isSelected = selectedTokenIndex === i;
            const badgeColor = isExceeded
              ? 'bg-red-950/80 border-red-500/50 text-red-300'
              : d.ent > 0.4
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';

            return (
              <button
                key={i}
                onClick={() => setSelectedTokenIndex(isSelected ? null : i)}
                className={`flex flex-col items-center border rounded-xl px-2.5 py-1.5 text-xs font-mono transition-all ${badgeColor} ${
                  isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
                }`}
              >
                <span className="font-medium text-white">{d.word}</span>
                <span className="text-[10px] opacity-80 mt-0.5">H: {d.ent.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Detail Modal/Panel */}
      {selectedTokenIndex !== null && entropyData[selectedTokenIndex] && (
        <div className="mb-4 bg-zinc-900 border border-zinc-700 p-4 rounded-2xl font-mono text-xs text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-400 font-bold">
              Token Detail: "{entropyData[selectedTokenIndex].word}"
            </span>
            <button
              onClick={() => setSelectedTokenIndex(null)}
              className="text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-zinc-300">
            <div>Entropy H: <span className="text-white font-bold">{entropyData[selectedTokenIndex].ent.toFixed(3)}</span></div>
            <div>Confidence: <span className="text-emerald-400 font-bold">{entropyData[selectedTokenIndex].conf.toFixed(1)}%</span></div>
            <div>Status: <span className={entropyData[selectedTokenIndex].ent > threshold ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {entropyData[selectedTokenIndex].ent > threshold ? 'RAG Candidate' : 'High Certainty'}
            </span></div>
          </div>
        </div>
      )}

      {/* Canvas Spectrum Chart */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black mb-4">
        <canvas ref={canvasRef} width={800} height={120} className="w-full h-[120px] block" />
      </div>

      {/* RAG Event Log Stream */}
      <div className="bg-black/80 border border-zinc-800/80 rounded-2xl p-3 font-mono text-xs text-zinc-500 h-24 overflow-y-auto">
        <div className="flex justify-between items-center text-zinc-400 mb-1 border-b border-zinc-800/60 pb-1">
          <span className="flex items-center gap-1.5 text-[10px]">
            <Terminal className="w-3 h-3 text-emerald-400" /> SYSTEM AUDIT LOG
          </span>
          {logs.length > 0 && (
            <button onClick={() => setLogs([])} className="text-zinc-500 hover:text-white text-[10px]">
              Clear
            </button>
          )}
        </div>
        {logs.length === 0 ? (
          <div className="text-zinc-600 text-center py-3">No RAG retrieval triggers logged yet.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-zinc-400 leading-tight py-0.5">
              &gt; {log}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RAGUncertaintySimulator;

