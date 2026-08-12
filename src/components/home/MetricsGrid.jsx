import { useEffect, useState } from 'react';

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
    }, 40);
    return () => clearInterval(timer);
  }, [to]);

  return <span>{val}{suffix}</span>;
};

const MetricsGrid = () => {
  return (
    <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-0 p-8 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-3xl my-16 mx-4 md:mx-auto max-w-5xl shadow-xl">
      <div className="text-center p-6 border-b md:border-b-0 md:border-r border-white/20">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter to={20} /></h3>
        <p className="text-gray-400 mt-4 font-mono uppercase tracking-widest text-[10px] font-semibold">Dispatches</p>
      </div>
      <div className="text-center p-6 border-b md:border-b-0 md:border-r border-white/20">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter to={6} /></h3>
        <p className="text-gray-400 mt-4 font-mono uppercase tracking-widest text-[10px] font-semibold">Models</p>
      </div>
      <div className="text-center p-6 border-r border-white/20">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter to={4} /></h3>
        <p className="text-gray-400 mt-4 font-mono uppercase tracking-widest text-[10px] font-semibold">Research Series</p>
      </div>
      <div className="text-center p-6">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter to={100} suffix="k+" /></h3>
        <p className="text-gray-400 mt-4 font-mono uppercase tracking-widest text-[10px] font-semibold">Downloads</p>
      </div>
    </section>
  );
};

export default MetricsGrid;
