import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { MathBlock } from '../../utils/renderMath';

const GRPOSimulator = () => {
  const canvasRef = useRef(null);
  const [isAutoRollout, setIsAutoRollout] = useState(true);
  const [klPenalty, setKlPenalty] = useState(0.1);
  const [groupSize, setGroupSize] = useState(8);
  const [rewardVariance, setRewardVariance] = useState(0.5);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const rewardsRef = useRef(Array(12).fill(0.5));
  const targetRewardsRef = useRef(Array(12).fill(0.5));
  const [stats, setStats] = useState({
    mean: '0.50',
    std: '0.00',
    maxAdv: '0.00',
    minAdv: '0.00',
    klLoss: '0.00'
  });

  const newRollout = useCallback(() => {
    const raw = Array.from({ length: groupSize }, () => {
      const base = 0.5 + (Math.random() * 0.8 - 0.4) * rewardVariance;
      return Math.max(0.05, Math.min(0.95, base));
    });

    targetRewardsRef.current = raw;

    const mean = raw.reduce((a, b) => a + b, 0) / groupSize;
    const variance = raw.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / groupSize;
    const std = Math.sqrt(variance) || 0.001;

    const advantages = raw.map(r => (r - mean) / std);
    const maxAdv = Math.max(...advantages).toFixed(2);
    const minAdv = Math.min(...advantages).toFixed(2);

    const klLoss = (klPenalty * 0.4).toFixed(3);

    setStats({
      mean: mean.toFixed(2),
      std: std.toFixed(2),
      maxAdv: maxAdv > 0 ? `+${maxAdv}` : maxAdv,
      minAdv,
      klLoss
    });
  }, [groupSize, rewardVariance, klPenalty]);

  // Handle periodic auto rollout
  useEffect(() => {
    newRollout();
    if (!isAutoRollout) return;
    const interval = setInterval(newRollout, 2200);
    return () => clearInterval(interval);
  }, [newRollout, isAutoRollout]);

  // Scaled canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Lerp smooth transition to target values
      const current = rewardsRef.current.slice(0, groupSize).map((val, i) => {
        const target = targetRewardsRef.current[i] || 0.5;
        return val + (target - val) * 0.12;
      });
      rewardsRef.current = current;

      const currentMeanRaw = current.reduce((a, b) => a + b, 0) / groupSize;
      const currentMeanAdjusted = currentMeanRaw - (klPenalty * 0.3);

      const paddingX = 60;
      const totalBarSpace = w - (paddingX * 2);
      const barWidth = Math.max(20, (totalBarSpace / groupSize) - 12);
      const spacing = 12;
      const maxH = h - 90;
      const baselineY = h - 40;

      // Draw Baseline grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, baselineY);
      ctx.lineTo(w - 30, baselineY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(156, 163, 175, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText('0.0 (BASE)', 30, baselineY + 16);

      // Draw Bars
      current.forEach((val, i) => {
        const netVal = Math.max(0.02, val - (klPenalty * 0.3));
        const barH = netVal * maxH;
        const x = paddingX + i * (barWidth + spacing);
        const y = baselineY - barH;

        const isAdvantageous = val >= currentMeanRaw;
        const isHovered = hoveredIndex === i;

        // Gradient for bar
        const gradient = ctx.createLinearGradient(x, y, x, baselineY);
        if (isAdvantageous) {
          gradient.addColorStop(0, isHovered ? '#00f0ff' : '#06b6d4');
          gradient.addColorStop(1, 'rgba(0, 240, 255, 0.2)');
        } else {
          gradient.addColorStop(0, isHovered ? '#f43f5e' : '#e11d48');
          gradient.addColorStop(1, 'rgba(225, 29, 72, 0.15)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw outcome label below bar
        ctx.fillStyle = isHovered ? '#ffffff' : '#9ca3af';
        ctx.font = '10px monospace';
        ctx.fillText(`o_${i + 1}`, x + (barWidth / 2) - 8, baselineY + 16);

        // Draw value top badge
        ctx.fillStyle = isAdvantageous ? '#00f0ff' : '#fb7185';
        ctx.font = '10px monospace';
        ctx.fillText(netVal.toFixed(2), x + (barWidth / 2) - 12, Math.max(20, y - 6));
      });

      // Draw Group Mean Line
      const meanY = baselineY - (Math.max(0, currentMeanAdjusted) * maxH);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(40, meanY);
      ctx.lineTo(w - 40, meanY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px monospace';
      ctx.fillText(`MEAN (${currentMeanAdjusted.toFixed(2)})`, w - 120, meanY - 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [groupSize, klPenalty, hoveredIndex]);

  // Scaled canvas pointer position for hover detection
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (e.clientX - rect.left) * scaleX;

    const w = canvas.width;
    const paddingX = 60;
    const totalBarSpace = w - (paddingX * 2);
    const barWidth = Math.max(20, (totalBarSpace / groupSize) - 12);
    const spacing = 12;

    let hit = null;
    for (let i = 0; i < groupSize; i++) {
      const barLeft = paddingX + i * (barWidth + spacing);
      const barRight = barLeft + barWidth;
      if (canvasX >= barLeft - 4 && canvasX <= barRight + 4) {
        hit = i;
        break;
      }
    }
    setHoveredIndex(hit);
  };

  return (
    <motion.div
      id="grpo-lab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 border border-amber-500/25 rounded-3xl p-6 sm:p-8 hover:border-amber-400/50 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-12 relative overflow-hidden group"
    >
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-mono text-xs font-semibold tracking-wider">02 / SIMULATOR</span>
            <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full font-mono">
              RL Alignment
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            GRPO Policy Alignment
          </h2>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-amber-500/20 px-4 py-2 rounded-2xl font-mono text-xs text-gray-300 shadow-inner">
          <div>
            <span className="text-gray-500 block text-[10px]">GROUP MEAN</span>
            <span className="text-amber-400 font-bold">{stats.mean}</span>
          </div>
          <div className="h-6 w-px bg-amber-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">STD DEV (σ)</span>
            <span className="text-white font-bold">{stats.std}</span>
          </div>
          <div className="h-6 w-px bg-amber-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">MAX ADV (A_i)</span>
            <span className="text-cyan-400 font-bold">{stats.maxAdv}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light">
        Group Relative Policy Optimization (GRPO) replaces critic networks by sampling a group of outputs G = &#123;o_1, ..., o_G&#125; per query, computing advantages relative to the group mean, with KL divergence penalty &beta;.
      </p>

      {/* KaTeX Math Formula */}
      <MathBlock formula={String.raw`\mathcal{L}_{GRPO} = -\mathbb{E}\left[\hat{A}_i \log \pi_\theta(o_i|q)\right] + \beta\,\mathbb{KL}(\pi_\theta \| \pi_{ref})`} />

      {/* Controls Bar */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center backdrop-blur-md">
        {/* Play/Pause & New Rollout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRollout(!isAutoRollout)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isAutoRollout
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isAutoRollout ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoRollout ? 'Auto' : 'Play'}
          </button>

          <button
            onClick={newRollout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white text-xs font-mono transition-all cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rollout
          </button>
        </div>

        {/* KL Penalty Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="kl-penalty-slider">KL_PENALTY (β):</label>
            <span className="text-amber-300 font-bold">{klPenalty.toFixed(2)}</span>
          </div>
          <input
            id="kl-penalty-slider"
            type="range"
            min="0.00"
            max="0.50"
            step="0.01"
            value={klPenalty}
            onChange={(e) => setKlPenalty(parseFloat(e.target.value))}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Group Size Selector */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="group-size-select">GROUP_SIZE (G):</label>
            <span className="text-amber-300 font-bold">{groupSize}</span>
          </div>
          <div className="flex gap-1">
            {[4, 6, 8, 12].map(g => (
              <button
                key={g}
                onClick={() => setGroupSize(g)}
                className={`flex-1 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  groupSize === g
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Reward Variance Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="reward-var-slider">NOISE_VAR:</label>
            <span className="text-amber-300 font-bold">{rewardVariance.toFixed(1)}</span>
          </div>
          <input
            id="reward-var-slider"
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={rewardVariance}
            onChange={(e) => setRewardVariance(parseFloat(e.target.value))}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-[280px] sm:h-[320px] block cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredIndex(null)}
        />

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && targetRewardsRef.current[hoveredIndex] !== undefined && (
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-cyan-500/30 text-white p-3 rounded-xl font-mono text-xs shadow-2xl backdrop-blur-md">
            <div className="text-amber-400 font-bold mb-1">Outcome o_{hoveredIndex + 1}</div>
            <div className="text-gray-300">Raw Reward: {(targetRewardsRef.current[hoveredIndex]).toFixed(3)}</div>
            <div className="text-gray-400">KL Penalty: -{(klPenalty * 0.3).toFixed(3)}</div>
            <div className="text-cyan-400 font-semibold mt-1">
              Net Reward: {(targetRewardsRef.current[hoveredIndex] - klPenalty * 0.3).toFixed(3)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GRPOSimulator;


