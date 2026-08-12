import React, { useState, useEffect, useRef } from 'react';
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

const DiffAttnSimulator = () => {
  const canvasRef = useRef(null);
  const [lambda, setLambda] = useState(1.0);
  const [snr, setSnr] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    let frameCount = 0;

    const noise = Array.from({length: 800}, () => (Math.random() * 2 - 1) * 20);

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      let signalPow = 0;
      let noisePow = 0;

      const drawWave = (color, fn, isOutput=false) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = isOutput ? 2 : 1;
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

      // A1: gray
      drawWave('rgba(255, 255, 255, 0.2)', (x, n) => Math.sin(x * 0.02 + time * 0.05) * 40 + n);
      // A2: dark gray
      drawWave('rgba(255, 255, 255, 0.1)', (x, n) => Math.sin((x + 20) * 0.02 + time * 0.05) * 35 + n);
      // Output: white
      drawWave('#ffffff', (x, n) => {
        const v1 = Math.sin(x * 0.02 + time * 0.05) * 40 + n;
        const v2 = Math.sin((x + 20) * 0.02 + time * 0.05) * 35 + n;
        return v1 - lambda * v2;
      }, true);

      if (frameCount % 15 === 0) {
        const computedSnr = 10 * Math.log10((signalPow + 1) / (noisePow + 1));
        setSnr(computedSnr.toFixed(1));
      }

      time += 2;
      frameCount++;
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [lambda]);

  return (
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} whileHover={cardHover}>
      <h3 style={headerStyle}><span style={{color: '#fff', marginRight:'10px', fontSize: '0.8em'}}>◆</span>Differential Attention Noise</h3>
      <MathBlock formula={String.raw`\text{DiffAttn}(Q,K,V) = (A_1 - \lambda A_2)\,V, \quad \lambda \in [0, 2]`} />
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        <div>
          <label htmlFor="lambda-range" style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
            LAMBDA (λ): {lambda.toFixed(2)}
          </label>
          <input id="lambda-range" name="lambda" aria-label="Lambda" type="range" min="0" max="2" step="0.05" value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#fff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#9ca3af' }}>
          <div>LIVE_SNR: {snr} dB</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.7rem' }}>
            <span style={{color: 'rgba(255, 255, 255, 0.4)'}}>■ A1</span>
            <span style={{color: 'rgba(255, 255, 255, 0.2)'}}>■ A2</span>
            <span style={{color: '#fff'}}>■ OUT</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} width={800} height={300} style={{ width: '100%', height: '300px', borderRadius: '12px', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }} />
    </motion.div>
  );
};

export default DiffAttnSimulator;
