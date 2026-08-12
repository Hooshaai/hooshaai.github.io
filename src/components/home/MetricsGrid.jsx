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
    { label: 'Dispatches', count: 20, suffix: '' },
    { label: 'Models Vault', count: 6, suffix: '' },
    { label: 'Research Series', count: 4, suffix: '' },
    { label: 'Downloads', count: 100, suffix: 'k+' },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-0 bg-gray-950/80 backdrop-blur-2xl border border-gray-800 rounded-3xl my-16 mx-4 md:mx-auto max-w-5xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden divide-y divide-x divide-gray-800/80"
    >
      {metrics.map((item, i) => (
        <div 
          key={item.label} 
          className="text-center p-6 sm:p-8 hover:bg-gray-900/50 transition-colors duration-300 group cursor-default"
        >
          <h3 className="text-3xl sm:text-5xl font-light text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
            <Counter to={item.count} suffix={item.suffix} />
          </h3>
          <p className="text-gray-400 mt-3 font-mono uppercase tracking-widest text-[10px] font-semibold flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity"></span>
            {item.label}
          </p>
        </div>
      ))}
    </motion.section>
  );
};

export default MetricsGrid;

