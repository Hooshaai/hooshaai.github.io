import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Counter = ({ to, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let current = 0;
    const step = Math.max(1, Math.floor(to / 25));
    const timer = setInterval(() => {
      current += step;
      if (current >= to) {
        setVal(to);
        clearInterval(timer);
      } else {
        setVal(current);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [to, isInView]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const Sparkline = ({ color = "#00f0ff" }) => (
  <svg className="w-full h-8 overflow-visible opacity-40 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 25" fill="none">
    <path
      d="M0 20 Q 25 5, 50 15 T 100 5"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M0 20 Q 25 5, 50 15 T 100 5 L 100 25 L 0 25 Z"
      fill={`url(#sparkline-grad-${color.replace('#', '')})`}
      opacity="0.25"
    />
    <defs>
      <linearGradient id={`sparkline-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const MetricsGrid = () => {
  const metrics = [
    { label: 'Dispatches', count: 20, suffix: '', icon: 'fa-newspaper', desc: 'Peer-reviewed research papers', trend: '+100% Open Access', color: '#00f0ff' },
    { label: 'Models Vault', count: 6, suffix: '', icon: 'fa-cube', desc: 'Open .safetensors checkpoints', trend: 'Safetensors Format', color: '#38bdf8' },
    { label: 'Research Series', count: 4, suffix: '', icon: 'fa-layer-group', desc: 'Core thematic tracks', trend: 'Continuous Flow & RLVR', color: '#a855f7' },
    { label: 'Downloads', count: 100, suffix: 'k+', icon: 'fa-download', desc: 'Community model pulls', trend: 'Global HuggingFace Reach', color: '#34d399' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-20 mx-4 md:mx-auto max-w-6xl"
    >
      {metrics.map((item) => (
        <motion.div 
          key={item.label}
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.25 }}
          className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-2xl shadow-xl hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(0,240,255,0.18)] transition-all duration-300 group overflow-hidden flex flex-col justify-between"
        >
          {/* Top cyan gradient glow bar on hover */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
                {item.label}
              </span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <i className={`fas ${item.icon} text-sm`}></i>
              </div>
            </div>

            <h3 className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors mb-2 drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Counter to={item.count} suffix={item.suffix} />
            </h3>

            <p className="text-slate-400 text-xs font-sans mb-4 leading-relaxed">
              {item.desc}
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800/60 mt-2">
            <Sparkline color={item.color} />
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400/90 font-medium">
              <span className="flex items-center gap-1">
                <i className="fas fa-chart-line text-[9px]"></i> {item.trend}
              </span>
              <span className="text-slate-500 uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default MetricsGrid;


