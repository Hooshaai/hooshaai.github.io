import React, { useState, useEffect, useMemo } from 'react';
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

const RAGUncertaintySimulator = () => {
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
    <motion.div style={cardStyle} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} whileHover={cardHover}>
      <h3 style={headerStyle}><span style={{color: '#fff', marginRight:'10px', fontSize: '0.8em'}}>◆</span>LLM Epistemic Uncertainty & RAG Gate</h3>
      <MathBlock formula={String.raw`\mathcal{H}(X) = -\sum_i p_i \log p_i, \quad \text{RAG gate: } \mathbb{1}[\mathcal{H} > \tau]`} />
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        <div>
          <label htmlFor="threshold-range" style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af' }}>
            THRESHOLD (τ): {threshold.toFixed(2)}
          </label>
          <input id="threshold-range" name="threshold" aria-label="Threshold" type="range" min="0.3" max="0.9" step="0.05" value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#fff' }} />
        </div>
        <div style={{ textAlign: 'right', color: '#9ca3af' }}>
          <div>CONF: {stats.conf}%</div>
          <div>MEAN_ENTROPY: {stats.meanEnt}</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <label htmlFor="rag-prompt-input" className="sr-only">Prompt Input</label>
        <textarea 
          id="rag-prompt-input"
          name="ragPrompt"
          aria-label="RAG Prompt Input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', fontFamily: 'Inter', fontSize: '1rem' }}
        />
        {stats.trig && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ position: 'absolute', top: '-15px', right: '-10px', background: '#fff', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}
          >
            RAG RETRIEVAL TRIGGERED
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', background: '#000', padding: '1rem', borderRadius: '12px', minHeight: '80px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {entropyData.map((d, i) => {
          const norm = Math.min(1, d.ent);
          const color = `rgba(255, 255, 255, ${Math.max(0.2, 1 - norm)})`;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>{d.word}</span>
              <div style={{ width: '100%', height: '4px', background: color, marginTop: '4px', borderRadius: '2px' }} />
            </div>
          )
        })}
      </div>
      
      <div style={{ color: '#6b7280', fontSize: '0.75rem', height: '60px', overflowY: 'auto', fontFamily: 'monospace' }}>
        {logs.map((log, i) => <div key={i}>&gt; {log}</div>)}
      </div>

    </motion.div>
  );
};

export default RAGUncertaintySimulator;
