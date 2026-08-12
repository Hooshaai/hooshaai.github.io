import { useState } from 'react';

const Ecosystem = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Model', 'Framework', 'Kernel', 'Hardware'];
  
  const techStack = [
    { name: 'PyTorch', cat: 'Frameworks', desc: 'Core deep learning framework.', icon: 'fa-fire' },
    { name: 'CUDA', cat: 'Kernel', desc: 'Hardware-level programming.', icon: 'fa-microchip' },
    { name: 'Triton', cat: 'Kernel', desc: 'Custom kernels.', icon: 'fa-water' },
    { name: 'HuggingFace', cat: 'Model', desc: 'Model weights hosting.', icon: 'fa-cube' },
    { name: 'Substack', cat: 'Frameworks', desc: 'Research journal.', icon: 'fa-pen-nib' },
    { name: 'University of Tehran', cat: 'Hardware', desc: 'Academic partner.', icon: 'fa-university' },
    { name: 'Sharif University', cat: 'Hardware', desc: 'Academic partner.', icon: 'fa-university' },
    { name: 'Python', cat: 'Frameworks', desc: 'Primary development language.', icon: 'fa-code' }
  ];

  return (
    <div className="ecosystem-page pt-32 px-4 max-w-7xl mx-auto mb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-6 tracking-tight text-white">Tech Ecosystem</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">The infrastructure, frameworks, and partnerships powering Hoosha AI's research platform.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-20">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
              activeTab === tab 
                ? 'bg-white text-black border-white' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {techStack.filter(t => activeTab === 'All' || t.cat === activeTab).map(tech => (
          <div key={tech.name} className="group bg-white/[0.02] p-8 text-center border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300 rounded-3xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <i className={`fas ${tech.icon} text-2xl text-white opacity-80`}></i>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mb-2">{tech.name}</h3>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-5 block">{tech.cat}</span>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{tech.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center tracking-tight text-white font-['Space_Grotesk']">Architecture Stack</h2>
        <div className="flex flex-col gap-4">
          {['Model Layer', 'Framework Layer', 'Kernel Layer', 'Hardware Layer'].map((layer, i) => (
            <div 
              key={layer}
              className={`p-6 rounded-2xl text-center border cursor-pointer transition-all duration-300 ${
                activeTab === layer.split(' ')[0] 
                  ? 'bg-white text-black border-white font-semibold scale-[1.01]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
              }`}
              onClick={() => setActiveTab(layer.split(' ')[0])}
            >
              <span className="tracking-wide text-sm md:text-base">{layer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;
