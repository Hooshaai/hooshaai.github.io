import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

const Counter = ({ from, to, suffix = "", duration = 2 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          setVal(Math.floor(value));
        }
      });
      return () => controls.stop();
    }
  }, [from, to, inView, duration]);

  return <span ref={nodeRef}>{val}{suffix}</span>;
};

const MetricsGrid = () => {
  return (
    <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-0 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl my-16 mx-4 md:mx-auto max-w-5xl">
      <div className="text-center p-6 border-b md:border-b-0 md:border-r border-white/10">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter from={0} to={20} /></h3>
        <p className="text-gray-500 mt-4 font-mono uppercase tracking-widest text-[10px]">Dispatches</p>
      </div>
      <div className="text-center p-6 border-b md:border-b-0 md:border-r border-white/10">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter from={0} to={6} /></h3>
        <p className="text-gray-500 mt-4 font-mono uppercase tracking-widest text-[10px]">Models</p>
      </div>
      <div className="text-center p-6 border-r border-white/10">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter from={0} to={4} /></h3>
        <p className="text-gray-500 mt-4 font-mono uppercase tracking-widest text-[10px]">Research Series</p>
      </div>
      <div className="text-center p-6">
        <h3 className="text-4xl md:text-5xl font-light text-white font-mono tracking-tight"><Counter from={0} to={100} suffix="k+" /></h3>
        <p className="text-gray-500 mt-4 font-mono uppercase tracking-widest text-[10px]">Downloads</p>
      </div>
    </section>
  );
};

export default MetricsGrid;
