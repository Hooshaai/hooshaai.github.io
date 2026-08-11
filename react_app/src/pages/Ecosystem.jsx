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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-6">Tech Ecosystem</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">The infrastructure, frameworks, and partnerships powering Hoosha AI's research platform.</p>
      </div>

      <div className="flex justify-center gap-2 mb-12">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {techStack.filter(t => activeTab === 'All' || t.cat === activeTab).map(tech => (
          <div key={tech.name} className="glass-card card p-6 text-center border border-gray-800 hover:border-purple-500/50 transition-all rounded-2xl">
            <i className={`fas ${tech.icon} text-4xl text-purple-400 mb-4`}></i>
            <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
            <span className="text-xs font-mono text-gray-500 mb-3 block">{tech.cat}</span>
            <p className="text-sm text-gray-400">{tech.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Interactive Architecture Stack</h2>
        <div className="flex flex-col gap-4">
          {['Model Layer', 'Framework Layer', 'Kernel Layer', 'Hardware Layer'].map((layer, i) => (
            <div 
              key={layer}
              className={`p-4 rounded-xl text-center border cursor-pointer transition-all hover:-translate-y-1 ${
                activeTab === layer.split(' ')[0] ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400 font-bold' : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(layer.split(' ')[0])}
            >
              {layer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;
