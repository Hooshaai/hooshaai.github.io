import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const cardStyle = {
  background: 'rgba(10,15,30,0.7)',
  border: '1px solid rgba(0,240,255,0.15)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

const formulaStyle = {
  background: 'rgba(0,0,0,0.4)',
  borderLeft: '3px solid #00f0ff',
  padding: '1rem',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '0.9rem',
  margin: '1rem 0',
  color: '#e2e8f0',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap'
};

const buttonStyle = {
  background: 'rgba(0,240,255,0.1)',
  border: '1px solid #00f0ff',
  color: '#00f0ff',
  padding: '0.5rem 1.2rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s ease',
  marginRight: '1rem',
  marginTop: '1rem'
};

const Simulation1 = () => {
  const canvasRef = useRef(null);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [particles, setParticles] = useState([]);
  const [step, setStep] = useState(0);
  const targetRef = useRef({ x: 400, y: 150 });
  const isDragging = useRef(false);

  const initParticles = useCallback(() => {
    const newParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100 + 50,
      y: Math.random() * 100 + 100,
      vx: 0,
      vy: 0,
      active: true
    }));
    setParticles(newParticles);
    setStep(0);
  }, []);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const target = targetRef.current;
      
      // Draw target
      ctx.beginPath();
      ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw source cluster area vaguely
      ctx.beginPath();
      ctx.arc(100, 150, 60, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.fill();

      let activeCount = 0;

      setParticles((prevParticles) => {
        const nextParticles = prevParticles.map((p) => {
          if (!p.active) return p;
          
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 5) {
            return { ...p, active: false };
          }

          const vx = (dx * 0.03 + Math.sin(p.y * 0.02) * 0.8) * flowSpeed;
          const vy = (dy * 0.03 + Math.cos(p.x * 0.02) * 0.8) * flowSpeed;
          
          const speedMag = Math.sqrt(vx*vx + vy*vy);
          const maxMag = 15;
          const normalizedMag = Math.min(speedMag / maxMag, 1);
          
          // Color based on velocity: cyan (0,240,255) to purple (168,85,247)
          const r = Math.round(0 + (168 - 0) * normalizedMag);
          const g = Math.round(240 + (85 - 240) * normalizedMag);
          const b = Math.round(255 + (247 - 255) * normalizedMag);

          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();

          activeCount++;

          return { ...p, x: p.x + vx, y: p.y + vy, vx, vy };
        });
        
        return nextParticles;
      });

      setStep(s => s + 1);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [flowSpeed]);

  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - targetRef.current.x;
    const dy = y - targetRef.current.y;
    if (Math.sqrt(dx*dx + dy*dy) < 30) {
      isDragging.current = true;
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
      <h3><span style={{color: '#00f0ff', marginRight:'10px'}}>◆</span>Continuous Flow Matching (CFM)</h3>
      <div style={formulaStyle}>
        $$dx_t = v_\theta(t, x_t)\,dt, \quad x_0 \sim p_0, \quad x_1 \sim p_1$$
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            Flow Speed: {flowSpeed.toFixed(1)}x
          </label>
          <input type="range" min="0.5" max="3" step="0.1" value={flowSpeed} onChange={e => setFlowSpeed(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#00f0ff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#94a3b8' }}>
          <div>Active Particles: {particles.filter(p => p.active).length} / 80</div>
          <div>Step: {step}</div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300} 
        style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#000', cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button style={buttonStyle} onClick={initParticles}>Reset Particles</button>
    </motion.div>
  );
};

const Simulation2 = () => {
  const canvasRef = useRef(null);
  const [klPenalty, setKlPenalty] = useState(0.1);
  const [rewards, setRewards] = useState(Array(8).fill(0.5));
  const [targetRewards, setTargetRewards] = useState(Array(8).fill(0.5));
  const meanRewardRef = useRef(0.5);
  const [stats, setStats] = useState({ mean: 0.5, advantage: 0 });

  const newRollout = useCallback(() => {
    const newTargets = Array(8).fill(0).map(() => Math.random());
    setTargetRewards(newTargets);
    const mean = newTargets.reduce((a,b)=>a+b, 0) / 8;
    meanRewardRef.current = mean;
    setStats({ mean: mean.toFixed(2), advantage: (Math.random() * 0.4 - 0.2).toFixed(2) });
  }, []);

  useEffect(() => {
    newRollout();
    const interval = setInterval(newRollout, 2000);
    return () => clearInterval(interval);
  }, [newRollout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setRewards(prev => {
        const next = prev.map((val, i) => {
          const target = targetRewards[i];
          return val + (target - val) * 0.1; // lerp
        });
        
        const w = canvas.width;
        const h = canvas.height;
        const barWidth = (w - 100) / 8;
        const spacing = 10;
        const maxH = h - 60;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.moveTo(0, h - 30);
        ctx.lineTo(w, h - 30);
        ctx.stroke();

        next.forEach((val, i) => {
          const finalVal = val - (klPenalty * 0.5);
          const barH = Math.max(10, finalVal * maxH);
          const x = 50 + i * (barWidth + spacing);
          const y = h - 30 - barH;

          ctx.fillStyle = finalVal > 0.6 ? '#22c55e' : (finalVal < 0.4 ? '#ef4444' : '#f59e0b');
          ctx.fillRect(x, y, barWidth, barH);
        });

        // Mean line
        const currentMean = next.reduce((a,b)=>a+b,0)/8 - (klPenalty * 0.5);
        ctx.strokeStyle = '#00f0ff';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const meanY = h - 30 - (currentMean * maxH);
        ctx.moveTo(30, meanY);
        ctx.lineTo(w - 30, meanY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#00f0ff';
        ctx.font = '12px Inter';
        ctx.fillText('Mean', w - 40, meanY - 5);

        return next;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetRewards, klPenalty]);

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
      <h3><span style={{color: '#00f0ff', marginRight:'10px'}}>◆</span>GRPO Policy Alignment</h3>
      <div style={formulaStyle}>
        $$\mathcal{'{L}'}_{'{GRPO}'} = -\mathbb{'{E}'}\left[\hat{'{A}'}_i \log \pi_\theta(o_i|q)\right] + \beta\,\mathbb{'{KL}'}(\pi_\theta \| \pi_{'{ref}'})$$
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            KL Penalty (β): {klPenalty.toFixed(2)}
          </label>
          <input type="range" min="0.01" max="0.5" step="0.01" value={klPenalty} onChange={e => setKlPenalty(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#00f0ff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#94a3b8' }}>
          <div>Mean Reward: {stats.mean}</div>
          <div>Group Adv: {stats.advantage}</div>
        </div>
      </div>

      <canvas ref={canvasRef} width={800} height={300} style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#000' }} />
      <button style={buttonStyle} onClick={newRollout}>New Rollout</button>
    </motion.div>
  );
};

const Simulation3 = () => {
  const canvasRef = useRef(null);
  const [lambda, setLambda] = useState(1.0);
  const [snr, setSnr] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const noise = Array.from({length: 800}, () => (Math.random() * 2 - 1) * 20);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      let signalPow = 0;
      let noisePow = 0;

      const drawWave = (color, fn, isOutput=false) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = isOutput ? 3 : 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const n = noise[(x + time) % noise.length];
          const y = cy + fn(x, n);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          if (isOutput) {
            const sig = fn(x, 0); // ideal without noise
            signalPow += sig*sig;
            const err = fn(x, n) - sig;
            noisePow += err*err;
          }
        }
        ctx.stroke();
      };

      // A1: cyan
      drawWave('rgba(0, 240, 255, 0.5)', (x, n) => Math.sin(x * 0.02 + time * 0.05) * 40 + n);
      // A2: purple
      drawWave('rgba(168, 85, 247, 0.5)', (x, n) => Math.sin((x + 20) * 0.02 + time * 0.05) * 35 + n);
      // Output: white
      drawWave('#ffffff', (x, n) => {
        const v1 = Math.sin(x * 0.02 + time * 0.05) * 40 + n;
        const v2 = Math.sin((x + 20) * 0.02 + time * 0.05) * 35 + n;
        return v1 - lambda * v2;
      }, true);

      const computedSnr = 10 * Math.log10((signalPow + 1) / (noisePow + 1));
      setSnr(computedSnr.toFixed(1));

      time += 2;
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [lambda]);

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
      <h3><span style={{color: '#00f0ff', marginRight:'10px'}}>◆</span>Differential Attention Noise</h3>
      <div style={formulaStyle}>
        $$\text{'{DiffAttn}'}(Q,K,V) = (A_1 - \lambda A_2)\,V, \quad \lambda \in [0, 2]$$
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            Lambda (λ): {lambda.toFixed(2)}
          </label>
          <input type="range" min="0" max="2" step="0.05" value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#00f0ff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#94a3b8' }}>
          <div>Live SNR Estimate: {snr} dB</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{color: 'rgba(0, 240, 255, 0.8)'}}>■ A1 Map</span>
            <span style={{color: 'rgba(168, 85, 247, 0.8)'}}>■ A2 Map</span>
            <span style={{color: '#fff'}}>■ Output</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} width={800} height={300} style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#000' }} />
    </motion.div>
  );
};

const Simulation4 = () => {
  const [prompt, setPrompt] = useState('Type your prompt here...');
  const [threshold, setThreshold] = useState(0.7);
  const [stats, setStats] = useState({ conf: 0, meanEnt: 0, trig: false });
  const [logs, setLogs] = useState([]);

  const words = useMemo(() => prompt.trim().split(/\s+/).filter(w=>w.length>0), [prompt]);

  const entropyData = useMemo(() => {
    return words.map(word => {
      // simulated entropy based on length
      const p = Math.max(0.01, 1 - (word.length * 0.1));
      const ent = -p * Math.log2(p) * 2; 
      const finalEnt = Math.min(1.5, Math.max(0, ent + (Math.random()*0.2)));
      return { word, ent: finalEnt };
    });
  }, [words]);

  useEffect(() => {
    if (entropyData.length === 0) {
      setStats({ conf: 100, meanEnt: 0, trig: false });
      return;
    }
    const meanEnt = entropyData.reduce((a,b)=>a+b.ent, 0) / entropyData.length;
    const isTrig = meanEnt > threshold;
    setStats({
      conf: Math.max(0, (1 - meanEnt) * 100).toFixed(1),
      meanEnt: meanEnt.toFixed(2),
      trig: isTrig
    });
    
    if (isTrig && entropyData.length > 3 && !logs.includes(`RAG Triggered at entropy ${meanEnt.toFixed(2)}`)) {
      setLogs(l => [`RAG Triggered at entropy ${meanEnt.toFixed(2)}`, ...l].slice(0, 5));
    }
  }, [entropyData, threshold]);

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
      <h3><span style={{color: '#00f0ff', marginRight:'10px'}}>◆</span>LLM Epistemic Uncertainty & RAG Gate</h3>
      <div style={formulaStyle}>
        $$\mathcal{'{H}'}(X) = -\sum_i p_i \log p_i, \quad \text{'{RAG gate: }'} \mathbb{'{1}'}[\mathcal{'{H}'} &gt; \tau]$$
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            Threshold (τ): {threshold.toFixed(2)}
          </label>
          <input type="range" min="0.3" max="0.9" step="0.05" value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#00f0ff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#94a3b8' }}>
          <div>Confidence: {stats.conf}%</div>
          <div>Mean Entropy: {stats.meanEnt}</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', padding: '1rem', fontFamily: 'Inter', fontSize: '1rem' }}
        />
        {stats.trig && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ position: 'absolute', top: '-15px', right: '-10px', background: '#ef4444', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)' }}
          >
            RAG RETRIEVAL TRIGGERED
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', background: '#000', padding: '1rem', borderRadius: '8px', minHeight: '80px' }}>
        {entropyData.map((d, i) => {
          // ent 0 to 1 -> green to red
          const norm = Math.min(1, d.ent);
          const r = Math.round(255 * norm);
          const g = Math.round(255 * (1 - norm));
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{d.word}</span>
              <div style={{ width: '100%', height: '4px', background: `rgb(${r}, ${g}, 0)`, marginTop: '4px', borderRadius: '2px' }} />
            </div>
          )
        })}
      </div>
      
      <div style={{ color: '#94a3b8', fontSize: '0.8rem', height: '60px', overflowY: 'auto' }}>
        {logs.map((log, i) => <div key={i}>&gt; {log}</div>)}
      </div>

    </motion.div>
  );
};

export default function Labs() {
  return (
    <div style={{ padding: '4rem 2rem', minHeight: '100vh', background: '#050810', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(90deg, #00f0ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
            Interactive AI Learning Labs
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2rem' }}>
            Explore the mathematical foundations of Hoosha AI research through real-time visualizations
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {['4 Simulations', 'Real-time Canvas', 'KaTeX Math', 'Open Source'].map(badge => (
              <span key={badge} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.9rem' }}>
                {badge}
              </span>
            ))}
          </div>
        </header>

        <Simulation1 />
        <Simulation2 />
        <Simulation3 />
        <Simulation4 />
      </div>
    </div>
  );
}
