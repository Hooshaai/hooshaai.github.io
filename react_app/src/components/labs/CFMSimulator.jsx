import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '../../utils/renderMath';

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: '2.5rem',
  marginBottom: '3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const cardHover = {
  borderColor: 'rgba(255, 255, 255, 0.3)',
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

const CFMSimulator = () => {
  const canvasRef = useRef(null);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const particlesRef = useRef([]);
  const stepRef = useRef(0);
  const [stats, setStats] = useState({ active: 0, step: 0 });
  const targetRef = useRef({ x: 400, y: 150 });
  const isDragging = useRef(false);

  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100 + 50,
      y: Math.random() * 100 + 100,
      vx: 0,
      vy: 0,
      active: true
    }));
    stepRef.current = 0;
    setStats({ active: 80, step: 0 });
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const target = targetRef.current;
      
      // Draw target
      ctx.beginPath();
      ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw source cluster area vaguely
      ctx.beginPath();
      ctx.arc(100, 150, 60, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();

      let activeCount = 0;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        if (!p.active) continue;
        
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) {
          p.active = false;
          continue;
        }

        const vx = (dx * 0.03 + Math.sin(p.y * 0.02) * 0.8) * flowSpeed;
        const vy = (dy * 0.03 + Math.cos(p.x * 0.02) * 0.8) * flowSpeed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#9ca3af';
        ctx.fill();

        activeCount++;
        p.x += vx;
        p.y += vy;
        p.vx = vx;
        p.vy = vy;
      }

      stepRef.current += 1;
      if (stepRef.current % 15 === 0) {
        setStats({ active: activeCount, step: stepRef.current });
      }
      
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
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} whileHover={cardHover}>
      <h3 style={headerStyle}><span style={{color: '#fff', marginRight:'10px', fontSize: '0.8em'}}>◆</span>Continuous Flow Matching (CFM)</h3>
      <MathBlock formula={String.raw`dx_t = v_\theta(t, x_t)\,dt, \quad x_0 \sim p_0, \quad x_1 \sim p_1`} />
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        <div>
          <label htmlFor="flow-speed-range" style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
            FLOW_SPEED: {flowSpeed.toFixed(1)}X
          </label>
          <input id="flow-speed-range" name="flowSpeed" aria-label="Flow Speed" type="range" min="0.5" max="3" step="0.1" value={flowSpeed} onChange={e => setFlowSpeed(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#fff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#9ca3af' }}>
          <div>ACTIVE: {stats.active} / 80</div>
          <div>STEP: {stats.step}</div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300} 
        style={{ width: '100%', height: '300px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#000', cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <motion.button style={buttonStyle} whileHover={buttonHover} whileTap={buttonTap} onClick={initParticles}>Reset Particles</motion.button>
    </motion.div>
  );
};

export default CFMSimulator;
