import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Radio } from 'lucide-react';
import { MathBlock } from '../../utils/renderMath';

const DiffAttnSimulator = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lambda, setLambda] = useState(1.0);
  const [noiseLevel, setNoiseLevel] = useState(1.0);
  const [frequency] = useState(1.0);
  const [snr, setSnr] = useState('0.0');

  const [showA1, setShowA1] = useState(true);
  const [showA2, setShowA2] = useState(true);
  const [showOut, setShowOut] = useState(true);

  const [probeData, setProbeData] = useState(null);

  // Pre-generate smooth, coherent fixed noise buffer (fixes 60fps frame jumping)
  const noiseBuffer = useMemo(() => {
    const arr = new Float32Array(1600);
    for (let i = 0; i < arr.length; i++) {
      // Harmonic combination for smooth noise shape
      arr[i] = (Math.sin(i * 0.08) * 0.4 + Math.cos(i * 0.17) * 0.35 + (Math.random() * 0.25 - 0.125)) * 24;
    }
    return arr;
  }, []);

  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let frameCount = 0;

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Draw Center Baseline Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      let signalPow = 0;
      let noisePow = 0;

      const drawWave = (color, width, fn, isOutput = false) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (isOutput) {
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();

        for (let x = 0; x < w; x++) {
          const noiseIndex = Math.floor((x + timeRef.current) % noiseBuffer.length);
          const n = noiseBuffer[noiseIndex] * noiseLevel;
          const y = cy + fn(x, n);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          if (isOutput) {
            const cleanSignal = fn(x, 0);
            signalPow += cleanSignal * cleanSignal;
            const noiseDiff = fn(x, n) - cleanSignal;
            noisePow += noiseDiff * noiseDiff;
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      // 1. Attention Head 1 (A1 - Cyan/Blue)
      if (showA1) {
        drawWave('rgba(59, 130, 246, 0.5)', 1.5, (x, n) => {
          return Math.sin(x * 0.02 * frequency + timeRef.current * 0.04) * 45 + n;
        });
      }

      // 2. Attention Head 2 (A2 - Purple)
      if (showA2) {
        drawWave('rgba(168, 85, 247, 0.5)', 1.5, (x, n) => {
          return Math.sin((x + 25) * 0.02 * frequency + timeRef.current * 0.04) * 40 + n;
        });
      }

      // 3. Differential Attention Output: (A1 - lambda * A2)
      if (showOut) {
        drawWave('#00f0ff', 2.5, (x, n) => {
          const a1 = Math.sin(x * 0.02 * frequency + timeRef.current * 0.04) * 45 + n;
          const a2 = Math.sin((x + 25) * 0.02 * frequency + timeRef.current * 0.04) * 40 + n;
          return a1 - lambda * a2;
        }, true);
      }

      if (frameCount % 12 === 0) {
        const computedSnr = 10 * Math.log10((signalPow + 1) / (noisePow + 1));
        setSnr(computedSnr.toFixed(1));
      }

      if (isPlaying) {
        timeRef.current += 1.5;
      }
      frameCount++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [lambda, noiseLevel, frequency, isPlaying, showA1, showA2, showOut, noiseBuffer]);

  // Scaled Pointer Hover Probe Inspection
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (e.clientX - rect.left) * scaleX;

    const noiseIndex = Math.floor((canvasX + timeRef.current) % noiseBuffer.length);
    const n = noiseBuffer[noiseIndex] * noiseLevel;

    const a1 = Math.sin(canvasX * 0.02 * frequency + timeRef.current * 0.04) * 45 + n;
    const a2 = Math.sin((canvasX + 25) * 0.02 * frequency + timeRef.current * 0.04) * 40 + n;
    const diff = a1 - lambda * a2;

    setProbeData({
      x: Math.round(canvasX),
      a1: a1.toFixed(1),
      a2: a2.toFixed(1),
      diff: diff.toFixed(1)
    });
  };

  return (
    <motion.div
      id="diffattn-lab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 border border-purple-500/25 rounded-3xl p-6 sm:p-8 hover:border-purple-400/50 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-12 relative overflow-hidden group"
    >
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-purple-400 font-mono text-xs font-semibold tracking-wider">03 / SIMULATOR</span>
            <span className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-0.5 rounded-full font-mono">
              Transformer Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Differential Attention (Diff Transformer)
          </h2>
        </div>

        {/* SNR Readout Indicator */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-purple-500/20 px-4 py-2 rounded-2xl font-mono text-xs text-gray-300 shadow-inner">
          <Radio className={`w-4 h-4 ${parseFloat(snr) > 12 ? 'text-cyan-400 animate-pulse' : 'text-amber-400'}`} />
          <div>
            <span className="text-gray-500 block text-[10px]">LIVE SNR</span>
            <span className={`font-bold ${parseFloat(snr) > 12 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {snr} dB
            </span>
          </div>
          <div className="h-6 w-px bg-purple-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">NOISE CANCELLATION</span>
            <span className="text-purple-300 font-bold">
              {Math.min(100, Math.max(0, Math.round((1 - Math.abs(1 - lambda)) * 100)))}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light">
        Differential Attention subtracts two separate attention maps $A_1 - \lambda A_2$ to cancel common-mode noise, enhancing signal-to-noise ratio (SNR) and key information retrieval in long context LLMs.
      </p>

      {/* KaTeX Formula */}
      <MathBlock formula={String.raw`\text{DiffAttn}(Q,K,V) = (A_1 - \lambda A_2)\,V, \quad \lambda \in [0, 2]`} />

      {/* Controls Bar */}
      <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center backdrop-blur-md">
        {/* Play/Pause Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isPlaying
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'
                : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Wave'}
          </button>
        </div>

        {/* Lambda Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="lambda-slider">LAMBDA (λ):</label>
            <span className="text-cyan-300 font-bold">{lambda.toFixed(2)}</span>
          </div>
          <input
            id="lambda-slider"
            type="range"
            min="0.00"
            max="2.00"
            step="0.05"
            value={lambda}
            onChange={(e) => setLambda(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Noise Level Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="noise-level-slider">NOISE_AMP:</label>
            <span className="text-purple-300 font-bold">{noiseLevel.toFixed(1)}</span>
          </div>
          <input
            id="noise-level-slider"
            type="range"
            min="0.0"
            max="2.0"
            step="0.1"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
            className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Layer Visibility Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowA1(!showA1)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              showA1
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                : 'bg-slate-800/50 border-gray-700 text-gray-500 line-through'
            }`}
          >
            ■ A₁
          </button>

          <button
            onClick={() => setShowA2(!showA2)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              showA2
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/50 border-gray-700 text-gray-500 line-through'
            }`}
          >
            ■ A₂
          </button>

          <button
            onClick={() => setShowOut(!showOut)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
              showOut
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-slate-800/50 border-gray-700 text-gray-500 line-through'
            }`}
          >
            ■ OUT (Diff)
          </button>
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-[280px] sm:h-[320px] block cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setProbeData(null)}
        />

        {/* Probe Hover Data Overlay */}
        {probeData && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-cyan-500/30 p-3 rounded-xl font-mono text-xs text-white backdrop-blur-md shadow-xl">
            <div className="text-gray-400 text-[10px] mb-1">PROBE POSITION x={probeData.x}px</div>
            <div className="text-blue-400">A₁ Signal: {probeData.a1}</div>
            <div className="text-purple-300">A₂ Signal: {probeData.a2}</div>
            <div className="text-cyan-400 font-bold border-t border-white/10 pt-1 mt-1">
              Out (A₁ - λA₂): {probeData.diff}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DiffAttnSimulator;


