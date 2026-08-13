import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Counter = ({ to, suffix = "" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(to / 20));
    const timer = setInterval(() => {
      current += step;
      if (current >= to) {
        setVal(to);
        clearInterval(timer);
      } else {
        setVal(current);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [to]);

  return <span>{val}{suffix}</span>;
};

const MetricsGrid = () => {
  const metrics = [
    { label: 'Dispatches', count: 20, suffix: '', icon: 'fa-newspaper', desc: 'Peer-reviewed dispatches' },
    { label: 'Models Vault', count: 6, suffix: '', icon: 'fa-cube', desc: 'Open .safetensors checkpoints' },
    { label: 'Research Series', count: 4, suffix: '', icon: 'fa-layer-group', desc: 'Core thematic tracks' },
    { label: 'Downloads', count: 100, suffix: 'k+', icon: 'fa-download', desc: 'Community model pulls' },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16 mx-4 md:mx-auto max-w-6xl"
    >
      {metrics.map((item, i) => (
        <motion.div 
          key={item.label}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all group overflow-hidden"
        >
          {/* Top subtle glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
              {item.label}
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
              <i className={`fas ${item.icon} text-sm`}></i>
            </div>
          </div>

          <h3 className="text-4xl font-bold text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors mb-1">
            <Counter to={item.count} suffix={item.suffix} />
          </h3>
          <p className="text-slate-500 text-xs font-sans">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default MetricsGrid;

