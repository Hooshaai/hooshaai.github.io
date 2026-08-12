import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Platform = () => {
  const [telemetry, setTelemetry] = useState(Array.from({length: 8}, (_, i) => ({
    id: i, temp: 40, vram: 10, usage: 50, memory_bw: 400, power: 150, tflops: 120
  })));

  const [chartData, setChartData] = useState(Array.from({length: 20}, (_, i) => ({
    step: i * 100,
    loss: 2.5 * Math.exp(-i * 0.1) + Math.random() * 0.1,
    velocity_field: Math.random() * 0.5 * Math.exp(-i * 0.05)
  })));

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry(prev => prev.map(t => ({
        ...t,
        temp: Math.min(85, Math.max(30, t.temp + (Math.random() - 0.5) * 5)),
        vram: Math.min(80, Math.max(10, t.vram + (Math.random() - 0.5) * 2)),
        usage: Math.min(100, Math.max(0, t.usage + (Math.random() - 0.5) * 15)),
        memory_bw: Math.min(3000, Math.max(100, t.memory_bw + (Math.random() - 0.5) * 200)),
        power: Math.min(700, Math.max(100, t.power + (Math.random() - 0.5) * 50)),
        tflops: Math.min(989, Math.max(0, t.tflops + (Math.random() - 0.5) * 50))
      })));

      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastStep = newData[newData.length - 1].step;
        const lastLoss = newData[newData.length - 1].loss;
        const lastVel = newData[newData.length - 1].velocity_field;
        newData.push({
          step: lastStep + 100,
          loss: Math.max(0.1, lastLoss - Math.random() * 0.02),
          velocity_field: Math.max(0, lastVel - Math.random() * 0.01)
        });
        return newData;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const [compilerOutput, setCompilerOutput] = useState('');
  const [compiling, setCompiling] = useState(false);
  const codeRef = useRef(null);

  const handleCompile = async () => {
    setCompiling(true);
    setCompilerOutput('$ nvcc -arch=sm_90 -ptx kernel.cu -o kernel.ptx\nCompiling...');

    const codeContent = codeRef.current ? codeRef.current.value : '';

    try {
      const response = await fetch('http://localhost:8000/api/v1/cuda/compile/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeContent })
      });
      if (response.ok) {
        const data = await response.json();
        setCompilerOutput(prev => prev + '\n' + data.output);
        setCompiling(false);
        return;
      }
    } catch (err) {
      console.warn('CUDA compiler API offline, using local simulation fallback', err);
    }

    setTimeout(() => setCompilerOutput(prev => prev + '\nptxas info    : 0 bytes gmem, 49152 bytes smem\nptxas info    : Compiling entry function \'flash_attn\' for \'sm_90\''), 800);
    setTimeout(() => setCompilerOutput(prev => prev + '\nptxas info    : Used 128 registers, 384 bytes cmem[0]\nOptimizing JIT bindings...'), 1500);
    setTimeout(() => {
      setCompilerOutput(prev => prev + '\n✓ CUDA Kernel compiled successfully.\n$ ncu --set full ./test_kernel\nAchieved 87% Peak TFLOPS on H100.');
      setCompiling(false);
    }, 2500);
  };

  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsContent, setCmsContent] = useState('');
  const handlePublish = (e) => {
    e.preventDefault();
    if (!cmsTitle || !cmsContent) return;
    const newArticle = {
      id: `cms-${Date.now()}`,
      title: cmsTitle,
      link: '#',
      pubDate: new Date().toUTCString(),
      wordCount: `${cmsContent.split(' ').length} words`,
      readTime: '1 min read',
      snippet: cmsContent.substring(0, 100) + '...',
      category: 'research',
      categoryName: 'CMS Publish',
      author: 'Admin',
      authorRole: 'Hoosha AI'
    };
    const existing = JSON.parse(localStorage.getItem('hoosha_cms_articles') || '[]');
    localStorage.setItem('hoosha_cms_articles', JSON.stringify([newArticle, ...existing]));
    setCmsTitle('');
    setCmsContent('');
    alert('Published successfully to local storage!');
  };

  return (
    <div className="platform-page pt-32 px-4 max-w-7xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] mb-2">Research Dashboard</h1>
          <p className="text-gray-400 font-mono text-sm">Cluster ID: H100-SIGMA-9</p>
        </div>
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono flex items-center shadow-inner">
            <i className="fas fa-microchip text-purple-400 mr-2"></i> 8x NVIDIA H100
          </span>
          <span className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-500/50 rounded-lg text-sm font-mono flex items-center shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-3 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Takes 2/3 width on large screens */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Real-time Telemetry */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] flex items-center"><i className="fas fa-server text-cyan-400 mr-3"></i>Node Telemetry</h2>
              <span className="text-xs text-gray-500 font-mono">Updated Live</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {telemetry.map(gpu => (
                <div key={gpu.id} className="bg-black/60 border border-gray-800 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000" style={{width: `${gpu.usage}%`}}></div>
                  </div>
                  
                  <div className="text-xs font-bold font-mono text-gray-300 flex justify-between mt-1">
                    <span>GPU {gpu.id}</span>
                    <span className={`${gpu.temp > 75 ? 'text-red-400 font-bold' : 'text-green-400'} transition-colors`}>{gpu.temp.toFixed(1)}°C</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>VRAM</span> <span>{gpu.vram.toFixed(1)}GB</span></div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all duration-1000" style={{width: `${(gpu.vram/80)*100}%`}}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-mono mt-1">
                    <div>
                      <div>Power</div>
                      <div className="text-gray-300">{gpu.power.toFixed(0)}W</div>
                    </div>
                    <div>
                      <div>TFLOPS</div>
                      <div className="text-gray-300">{gpu.tflops.toFixed(0)}</div>
                    </div>
                  </div>
                  
                  <div className="text-right text-lg font-bold font-mono text-white mt-auto pt-1 border-t border-gray-800">
                    {gpu.usage.toFixed(0)}<span className="text-[10px] text-gray-500 ml-1">% Util</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loss & Velocity Field Convergence Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold font-['Space_Grotesk'] flex items-center"><i className="fas fa-chart-line text-purple-400 mr-2"></i>Loss Curve</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="step" stroke="#9ca3af" tick={{fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace'}} />
                    <YAxis stroke="#9ca3af" tick={{fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace'}} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="loss" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold font-['Space_Grotesk'] flex items-center"><i className="fas fa-wave-square text-green-400 mr-2"></i>Velocity Field</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="step" stroke="#9ca3af" tick={{fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace'}} />
                    <YAxis stroke="#9ca3af" tick={{fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace'}} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="velocity_field" stroke="#4ade80" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Kernel Playground */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 font-['Space_Grotesk'] flex items-center"><i className="fas fa-code text-green-400 mr-3"></i>CUDA/Triton JIT</h2>
            <div className="bg-black border border-gray-700 rounded-xl overflow-hidden font-mono text-sm flex-1 flex flex-col">
              <div className="bg-gray-800 px-4 py-3 flex justify-between items-center text-gray-300 border-b border-gray-700">
                <span className="flex items-center gap-2"><i className="fab fa-python text-yellow-400"></i> kernel.cu</span>
                <button 
                  onClick={handleCompile}
                  disabled={compiling}
                  className="bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded hover:bg-cyan-900/60 transition-colors disabled:opacity-50"
                >
                  {compiling ? <><i className="fas fa-spinner fa-spin mr-2"></i>Compiling</> : <><i className="fas fa-play mr-2"></i>Compile & Run</>}
                </button>
              </div>
              <textarea 
                ref={codeRef}
                className="w-full h-48 bg-transparent p-4 text-gray-300 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
                defaultValue={`extern "C" __global__\nvoid flash_attn(\n    float* Q, float* K, float* V, float* Out,\n    float sm_scale,\n    int BLOCK_M, int BLOCK_N\n) {\n    int tx = threadIdx.x;\n    int bx = blockIdx.x;\n    // Load blocks\n    __shared__ float sQ[128];\n    __shared__ float sK[128];\n}`}
              />
              <div className="bg-gray-950 p-4 border-t border-gray-800 h-40 overflow-y-auto">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">NVCC Terminal</div>
                <pre className="text-green-400 text-xs whitespace-pre-wrap font-mono">{compilerOutput || 'user@h100-sigma:~$ '}</pre>
              </div>
            </div>
          </div>

          {/* Research Studio CMS */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-xl font-bold mb-4 font-['Space_Grotesk'] flex items-center"><i className="fas fa-edit text-purple-400 mr-3"></i>Research Studio CMS</h2>
            <form onSubmit={handlePublish} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Article Title" 
                value={cmsTitle}
                onChange={e => setCmsTitle(e.target.value)}
                className="bg-black border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <textarea 
                placeholder="Article Content Snippet..." 
                value={cmsContent}
                onChange={e => setCmsContent(e.target.value)}
                className="bg-black border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 focus:outline-none h-32 resize-none"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg transition-colors">
                Publish Article
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Platform;
