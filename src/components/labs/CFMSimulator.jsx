import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, EyeOff, Move } from 'lucide-react';
import { MathBlock } from '../../utils/renderMath';

const CFMSimulator = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flowSpeed, setFlowSpeed] = useState(1.0);
  const [particleCount, setParticleCount] = useState(80);
  const [showVectorField, setShowVectorField] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState({ active: 80, step: 0, avgVel: '0.00' });

  const particlesRef = useRef([]);
  const stepRef = useRef(0);
  const targetRef = useRef({ x: 550, y: 150 });
  const isDraggingRef = useRef(false);

  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: 100 + (Math.random() * 80 - 40),
      y: 150 + (Math.random() * 80 - 40),
      vx: 0,
      vy: 0,
      active: true,
      trail: []
    }));
    stepRef.current = 0;
    setStats({ active: particleCount, step: 0, avgVel: '0.00' });
  }, [particleCount]);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // Helper to convert client coordinates to intrinsic canvas resolution coordinates
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const target = targetRef.current;

      // 1. Draw background grid & electric cyan vector field if enabled
      if (showVectorField) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.lineWidth = 1;
        const gridSpacing = 40;
        for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
          for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
            const dx = target.x - x;
            const dy = target.y - y;
            const angle = Math.atan2(dy, dx);
            const len = 14;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
            ctx.stroke();

            // Arrow tip dot with cyan glow
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * len, y + Math.sin(angle) * len, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
            ctx.fill();
          }
        }
      }

      // 2. Draw source cluster p0 (start region)
      ctx.beginPath();
      ctx.arc(100, 150, 55, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(147, 197, 253, 0.8)';
      ctx.font = '10px monospace';
      ctx.fillText('Source p₀', 75, 154);

      // 3. Draw Target p1 node (draggable electric cyan target)
      ctx.beginPath();
      ctx.arc(target.x, target.y, isDraggingRef.current ? 20 : 14, 0, Math.PI * 2);
      ctx.fillStyle = isDraggingRef.current ? 'rgba(0, 240, 255, 0.35)' : 'rgba(0, 240, 255, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(target.x, target.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`Target p₁ (${Math.round(target.x)}, ${Math.round(target.y)})`, target.x - 45, target.y - 18);

      // 4. Update and draw particles if playing
      let activeCount = 0;
      let totalVelSum = 0;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        if (!p.active) continue;

        if (isPlaying) {
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 8) {
            p.active = false;
            continue;
          }

          // Vector field math: linear velocity towards target + orthogonal flow oscillation
          const vx = (dx * 0.025 + Math.sin(p.y * 0.03 + stepRef.current * 0.05) * 0.7) * flowSpeed;
          const vy = (dy * 0.025 + Math.cos(p.x * 0.03 + stepRef.current * 0.05) * 0.7) * flowSpeed;

          p.x += vx;
          p.y += vy;
          p.vx = vx;
          p.vy = vy;

          // Record trail history
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
        }

        const currentVel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        totalVelSum += currentVel;
        activeCount++;

        // Draw particle trail with cyan gradient glow
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.active ? '#ffffff' : '#475569';
        if (p.active) {
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (isPlaying) {
        stepRef.current += 1;
      }

      if (stepRef.current % 10 === 0) {
        const avgVel = activeCount > 0 ? (totalVelSum / activeCount).toFixed(2) : '0.00';
        setStats({ active: activeCount, step: stepRef.current, avgVel });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [flowSpeed, isPlaying, showVectorField]);

  // Handle Scaled Pointer Events
  const handlePointerDown = (e) => {
    const coords = getCanvasCoords(e);
    const dx = coords.x - targetRef.current.x;
    const dy = coords.y - targetRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) < 35) {
      isDraggingRef.current = true;
      setIsDragging(true);
      if (e.target.setPointerCapture) {
        e.target.setPointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current) {
      const coords = getCanvasCoords(e);
      targetRef.current = {
        x: Math.max(30, Math.min(770, coords.x)),
        y: Math.max(30, Math.min(270, coords.y))
      };
    }
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      if (e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch {
          // ignore invalid pointer id release error
        }
      }
    }
  };

  return (
    <motion.div
      id="cfm-lab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 border border-cyan-500/25 rounded-3xl p-6 sm:p-8 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-12 relative overflow-hidden group"
    >
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider">01 / SIMULATOR</span>
            <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
              Generative Dynamics
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Continuous Flow Matching (CFM)
          </h2>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-cyan-500/20 px-4 py-2 rounded-2xl font-mono text-xs text-gray-300 shadow-inner">
          <div>
            <span className="text-gray-500 block text-[10px]">ACTIVE</span>
            <span className="text-cyan-400 font-bold">{stats.active}</span> / {particleCount}
          </div>
          <div className="h-6 w-px bg-cyan-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">STEP</span>
            <span className="text-white font-bold">{stats.step}</span>
          </div>
          <div className="h-6 w-px bg-cyan-500/20" />
          <div>
            <span className="text-gray-500 block text-[10px]">AVG VEL</span>
            <span className="text-emerald-400 font-bold">{stats.avgVel}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light">
        CFM constructs continuous vector fields $v_\theta(t, x_t)$ pushing particles directly from source noise $p_0$ to target data distribution $p_1$ without stochastic diffusion noise schedules.
      </p>

      {/* KaTeX Math Formula */}
      <MathBlock formula={String.raw`dx_t = v_\theta(t, x_t)\,dt, \quad x_0 \sim p_0, \quad x_1 \sim p_1`} />

      {/* Interactive Controls Bar */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center backdrop-blur-md">
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Flow'}
          </button>

          <button
            onClick={initParticles}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white text-xs font-mono transition-all cursor-pointer border border-white/10"
            title="Reset Particles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={() => setShowVectorField(!showVectorField)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
              showVectorField
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/80 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Vector Field Grid"
          >
            {showVectorField ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Vector Grid
          </button>
        </div>

        {/* Speed Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="flow-speed-slider">FLOW_SPEED:</label>
            <span className="text-cyan-300 font-bold">{flowSpeed.toFixed(1)}x</span>
          </div>
          <input
            id="flow-speed-slider"
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={flowSpeed}
            onChange={(e) => setFlowSpeed(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Particle Count Slider */}
        <div className="font-mono text-xs">
          <div className="flex justify-between text-gray-400 mb-1">
            <label htmlFor="particle-count-slider">PARTICLES:</label>
            <span className="text-cyan-300 font-bold">{particleCount}</span>
          </div>
          <input
            id="particle-count-slider"
            type="range"
            min="30"
            max="200"
            step="10"
            value={particleCount}
            onChange={(e) => setParticleCount(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Responsive Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-black group">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className={`w-full h-[280px] sm:h-[320px] block touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* Drag Target Tip Overlay */}
        <div className="absolute top-3 right-3 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 text-gray-300 px-3 py-1.5 rounded-xl font-mono text-[11px] flex items-center gap-1.5 shadow-lg">
          <Move className="w-3 h-3 text-cyan-400 animate-bounce" />
          <span>Click & Drag Target Node</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CFMSimulator;


