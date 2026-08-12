import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '../../utils/renderMath';

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  padding: '2.5rem',
  marginBottom: '3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const cardHover = {
  borderColor: 'rgba(255, 255, 255, 0.5)',
  transition: { duration: 0.3 }
};

const buttonStyle = {
  background: '#ffffff',
  color: '#000000',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  letterSpacing: '0.05em',
  alignSelf: 'flex-start',
  display: 'inline-block',
  border: 'none',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
};

const buttonHover = { 
  background: '#e5e7eb',
};

const buttonTap = { scale: 0.98 };

const headerStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.25rem',
  fontFamily: "'Space Grotesk', sans-serif"
};

const GRPOSimulator = () => {
  const canvasRef = useRef(null);
  const [klPenalty, setKlPenalty] = useState(0.1);
  const rewardsRef = useRef(Array(8).fill(0.5));
  const targetRewardsRef = useRef(Array(8).fill(0.5));
  const meanRewardRef = useRef(0.5);
  const [stats, setStats] = useState({ mean: 0.5, advantage: 0 });

  const newRollout = useCallback(() => {
    const newTargets = Array(8).fill(0).map(() => Math.random());
    targetRewardsRef.current = newTargets;
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const next = rewardsRef.current.map((val, i) => {
        const target = targetRewardsRef.current[i];
        return val + (target - val) * 0.1; // lerp
      });
      rewardsRef.current = next;
      
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

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth, barH);
      });

      // Mean line
      const currentMean = next.reduce((a,b)=>a+b,0)/8 - (klPenalty * 0.5);
      ctx.strokeStyle = '#6b7280';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const meanY = h - 30 - (currentMean * maxH);
      ctx.moveTo(30, meanY);
      ctx.lineTo(w - 30, meanY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px monospace';
      ctx.fillText('MEAN', w - 40, meanY - 5);

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [klPenalty]);

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} whileHover={cardHover}>
      <h3 style={headerStyle}><span style={{color: '#fff', marginRight:'10px', fontSize: '0.8em'}}>◆</span>GRPO Policy Alignment</h3>
      <MathBlock formula={String.raw`\mathcal{L}_{GRPO} = -\mathbb{E}\left[\hat{A}_i \log \pi_\theta(o_i|q)\right] + \beta\,\mathbb{KL}(\pi_\theta \| \pi_{ref})`} />
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        <div>
          <label htmlFor="kl-penalty-range" style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
            KL_PENALTY (β): {klPenalty.toFixed(2)}
          </label>
          <input id="kl-penalty-range" name="klPenalty" aria-label="KL Penalty" type="range" min="0.01" max="0.5" step="0.01" value={klPenalty} onChange={e => setKlPenalty(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#fff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#9ca3af' }}>
          <div>MEAN_REWARD: {stats.mean}</div>
          <div>GROUP_ADV: {stats.advantage}</div>
        </div>
      </div>

      <canvas ref={canvasRef} width={800} height={300} style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }} />
      <motion.button style={buttonStyle} whileHover={buttonHover} whileTap={buttonTap} onClick={newRollout}>New Rollout</motion.button>
    </motion.div>
  );
};

export default GRPOSimulator;
