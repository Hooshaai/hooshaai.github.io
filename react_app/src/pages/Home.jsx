import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { ALL_ARTICLES } from '../data/articles';

const NeuralCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const nodes = [];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();
        
        nodes.forEach(other => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="neuralCanvas" className="fixed top-0 left-0 w-screen h-screen -z-10 opacity-60 pointer-events-none" />;
};

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

const Home = () => {
  const latestArticles = ALL_ARTICLES ? ALL_ARTICLES.slice(0, 3) : [];

  return (
    <div className="home-page">
      <NeuralCanvas />
      
      <section className="hero min-h-screen flex flex-col justify-center items-center text-center pt-32 pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-badge inline-flex items-center gap-2 bg-cyan-900/20 border border-cyan-500/50 px-4 py-2 rounded-full font-mono text-sm text-cyan-400 mb-8"
        >
          <span className="pulse-dot w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></span>
          New Release: Continuous Flow Matching
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title text-5xl md:text-7xl font-bold font-['Space_Grotesk'] mb-6"
        >
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Beyond Bigger Datasets</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-subtitle text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
        >
          Building the next generation of AI reasoning engines with post-training reinforcement learning, linear attention, and verified logic.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hero-actions flex gap-4"
        >
          <Link to="/research" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">Read Research</Link>
          <Link to="/models" className="bg-purple-900/30 text-white border border-purple-500 px-8 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors shadow-[0_0_20px_rgba(138,43,226,0.3)]">Explore Models</Link>
        </motion.div>
      </section>

      <section className="stats-bar grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl my-12 mx-auto max-w-5xl">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-cyan-400 font-mono"><Counter from={0} to={20} /></h3>
          <p className="text-gray-400 mt-2 font-medium uppercase tracking-wider text-sm">Dispatches</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold text-purple-400 font-mono"><Counter from={0} to={6} /></h3>
          <p className="text-gray-400 mt-2 font-medium uppercase tracking-wider text-sm">Models</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold text-cyan-400 font-mono"><Counter from={0} to={4} /></h3>
          <p className="text-gray-400 mt-2 font-medium uppercase tracking-wider text-sm">Research Series</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold text-purple-400 font-mono"><Counter from={0} to={100} suffix="k+" /></h3>
          <p className="text-gray-400 mt-2 font-medium uppercase tracking-wider text-sm">Downloads</p>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <div className="w-full overflow-hidden bg-black/50 py-6 border-y border-gray-800 mb-20 relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-dark)] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-dark)] to-transparent z-10"></div>
        <motion.div 
          animate={{ x: [0, -1035] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-16 items-center whitespace-nowrap text-gray-500 font-mono text-xl"
        >
          {Array(4).fill([
            {name: 'PyTorch', icon: 'fa-fire'}, 
            {name: 'CUDA', icon: 'fa-microchip'}, 
            {name: 'Triton', icon: 'fa-water'}, 
            {name: 'HuggingFace', icon: 'fa-cube'}, 
            {name: 'React', icon: 'fab fa-react'}, 
            {name: 'Vite', icon: 'fa-bolt'}, 
            {name: 'Recharts', icon: 'fa-chart-line'}, 
            {name: 'Framer', icon: 'fa-framer'}
          ]).flat().map((tech, i) => (
            <span key={i} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
              <i className={`fas ${tech.icon}`}></i> {tech.name}
            </span>
          ))}
        </motion.div>
      </div>

      <section className="research-series p-4 mb-20">
        <h2 className="text-3xl font-bold text-center font-['Space_Grotesk'] mb-12">Featured Research Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Linear Attention', icon: 'fa-stream', color: 'from-cyan-500/20 to-transparent border-cyan-500/30' },
            { name: 'Verification', icon: 'fa-shield-alt', color: 'from-purple-500/20 to-transparent border-purple-500/30' },
            { name: 'Cognition', icon: 'fa-brain', color: 'from-green-500/20 to-transparent border-green-500/30' },
            { name: 'Consciousness', icon: 'fa-eye', color: 'from-red-500/20 to-transparent border-red-500/30' }
          ].map((series, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={series.name} 
              className={`glass-card card p-8 rounded-2xl border bg-gradient-to-br ${series.color} hover:shadow-lg hover:-translate-y-1 transition-all`}
            >
              <i className={`fas ${series.icon} text-4xl mb-6 text-white opacity-80`}></i>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-3">{series.name}</h3>
              <p className="text-gray-400 mb-6">Explore our fundamental breakthroughs in {series.name.toLowerCase()} architecture.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono px-3 py-1 bg-black/50 rounded-full border border-gray-700">4 Articles</span>
                <Link to="/research" className="text-white hover:underline text-sm font-medium">Explore Series &rarr;</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="latest-articles p-4 mb-20">
        <h2 className="text-3xl font-bold text-center font-['Space_Grotesk'] mb-12">Latest Dispatches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {latestArticles.map(article => (
            <div key={article.id} className="glass-card card flex flex-col p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all group">
              <div className="text-xs font-mono text-cyan-400 mb-3 border border-cyan-500/30 self-start px-2 py-1 rounded">
                {article.categoryName}
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-3 group-hover:text-cyan-400 transition-colors">{article.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{article.snippet}</p>
              <Link to={`/research?article=${article.id}`} className="text-white font-medium hover:underline inline-flex items-center">
                Read Article <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
