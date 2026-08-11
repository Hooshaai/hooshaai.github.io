import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const CfmCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = 300;
    
    let particles = Array.from({length: 100}, () => ({
      x: Math.random() * w, 
      y: Math.random() * h, 
      age: Math.random() * 100
    }));

    let id;
    let mouseX = w/2;
    let mouseY = h/2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
      ctx.fillRect(0, 0, w, h);
      
      particles.forEach(p => {
        // Vector field towards mouse (target point)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        
        // Add curl/swirl
        const vx = (dx / dist) * 2 + Math.sin(p.y * 0.05) * 1.5;
        const vy = (dy / dist) * 2 + Math.cos(p.x * 0.05) * 1.5;
        
        p.x += vx;
        p.y += vy;
        p.age++;
        
        if (dist < 10 || p.age > 150) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.age = 0;
        }
        
        ctx.fillStyle = `rgba(0, 240, 255, ${1 - p.age/150})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2);
        ctx.fill();
      });

      // Draw Target
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 8, 0, Math.PI*2);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      id = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(id);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full rounded-xl border border-gray-800 bg-black mb-4 cursor-crosshair" />;
};

const GrpoInteractive = () => {
  const [rewards, setRewards] = useState([0.2, 0.5, 0.8, 0.4, 0.9, 0.1, 0.6, 0.3]);
  
  useEffect(() => {
    const id = setInterval(() => {
      setRewards(prev => prev.map(r => Math.max(0, Math.min(1, r + (Math.random() - 0.5) * 0.2))));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const mean = rewards.reduce((a,b) => a+b, 0) / rewards.length;

  return (
    <div className="h-[300px] bg-black rounded-xl border border-gray-800 flex items-center justify-center mb-4 relative overflow-hidden px-4">
      <div className="flex w-full justify-between items-end h-[80%] z-10 gap-2">
        {rewards.map((h, i) => {
          const advantage = h - mean;
          return (
            <motion.div 
              key={i} 
              className={`flex-1 rounded-t ${advantage > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
              animate={{ height: `${h * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          );
        })}
      </div>
      <motion.div 
        className="absolute w-full h-[2px] bg-cyan-400 z-20 shadow-[0_0_10px_cyan]"
        animate={{ top: `${(1 - mean) * 80 + 10}%` }}
      />
      <div className="absolute top-2 left-4 text-xs text-cyan-400 font-mono bg-black/80 px-2 py-1 rounded">Group Mean: {mean.toFixed(2)}</div>
    </div>
  );
};

const DiffAttention = () => {
  const [lambda, setLambda] = useState(0.5);
  const data = Array.from({length: 50}, (_, i) => ({
    x: i,
    signal1: Math.sin(i * 0.2) + (Math.random() * 0.5 * (1-lambda)),
    signal2: Math.sin(i * 0.2 + Math.PI) + (Math.random() * 0.5 * (1-lambda))
  }));

  return (
    <div className="bg-black rounded-xl border border-gray-800 p-4 mb-4">
      <div className="h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="signal1" stroke="#22d3ee" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="signal2" stroke="#a855f7" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
        <span>Noise (λ):</span>
        <input 
          type="range" min="0" max="1" step="0.01" value={lambda} 
          onChange={e => setLambda(parseFloat(e.target.value))}
          className="flex-1 accent-cyan-400"
        />
        <span>{lambda.toFixed(2)}</span>
      </div>
    </div>
  );
};

const EntropyProbe = () => {
  const text = "The quick brown fox jumps over the lazy dog";
  const words = text.split(" ");
  
  return (
    <div className="bg-black rounded-xl border border-gray-800 p-6 mb-4 font-mono">
      <div className="flex flex-wrap gap-2 mb-4">
        {words.map((w, i) => {
          const entropy = Math.random();
          return (
            <div key={i} className="flex flex-col items-center">
              <span className="text-sm text-gray-300">{w}</span>
              <div 
                className="w-full h-1 mt-1 rounded" 
                style={{ backgroundColor: `hsl(${(1-entropy)*120}, 100%, 50%)` }}
              ></div>
              <span className="text-[10px] text-gray-500">{entropy.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
      <div className="text-xs text-gray-500 text-center">Color mapping: Red = High Entropy (Uncertain), Green = Low Entropy (Certain)</div>
    </div>
  );
};

const Labs = () => {
  return (
    <div className="labs-page pt-32 px-4 max-w-7xl mx-auto mb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-6">AI Learning Labs</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Interactive simulations and visualizations of our core mathematical concepts. Manipulate the parameters to build intuition.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Module 1: CFM */}
        <div className="glass-card card p-8 border border-gray-800 rounded-2xl hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">1. CFM Vector Field</h2>
            <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded text-xs font-mono">Interactive</span>
          </div>
          <CfmCanvas />
          <p className="text-gray-400 text-sm mb-4">Continuous Flow Matching models learn a deterministic ODE trajectory. Move your mouse to change the target distribution sink.</p>
          <div className="bg-black/50 p-3 rounded-lg font-mono text-cyan-400 text-sm text-center border border-gray-800">
            d(\mathbf{x}_t)/dt = (v_\theta(\mathbf{x}_t))
          </div>
        </div>

        {/* Module 2: GRPO */}
        <div className="glass-card card p-8 border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">2. GRPO Optimization</h2>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded text-xs font-mono">Live Data</span>
          </div>
          <GrpoInteractive />
          <p className="text-gray-400 text-sm mb-4">Group Relative Policy Optimization computes advantage relative to a sampled group mean, shown by the horizontal line.</p>
          <div className="bg-black/50 p-3 rounded-lg font-mono text-purple-400 text-sm text-center border border-gray-800">
            A_i = (R_i - (\mu(R))) / (\sigma(R))
          </div>
        </div>

        {/* Module 3: Differential Attention */}
        <div className="glass-card card p-8 border border-gray-800 rounded-2xl hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">3. Differential Attention</h2>
            <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded text-xs font-mono">Parametric</span>
          </div>
          <DiffAttention />
          <p className="text-gray-400 text-sm mb-4">Cancels out common-mode noise across attention heads by subtracting paired waveforms.</p>
          <div className="bg-black/50 p-3 rounded-lg font-mono text-cyan-400 text-sm text-center border border-gray-800">
            Attn_diff = Softmax(Q_1 K_1^T) - \lambda Softmax(Q_2 K_2^T)
          </div>
        </div>

        {/* Module 4: Epistemic Entropy Probe */}
        <div className="glass-card card p-8 border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">4. Epistemic Entropy Probe</h2>
            <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded text-xs font-mono">Visualization</span>
          </div>
          <EntropyProbe />
          <p className="text-gray-400 text-sm mb-4">Visualizing token-level uncertainty. High entropy indicates the model should defer to parametric retrieval (RAG).</p>
          <div className="bg-black/50 p-3 rounded-lg font-mono text-purple-400 text-sm text-center border border-gray-800">
            H_l(x) = -\sum P_l(v|x) \log P_l(v|x)
          </div>
        </div>

      </div>
    </div>
  );
};

export default Labs;
