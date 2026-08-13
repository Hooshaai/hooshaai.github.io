import { useState, useMemo } from 'react';

const parseNumberWithSuffix = (val) => {
  if (val === null || val === undefined || val === 'N/A' || val === 'Unknown' || val === '-') return -Infinity;
  if (typeof val === 'number') return val;
  const str = String(val).trim().toUpperCase();
  const match = str.match(/([\d.]+)\s*([KMBGT]?)/i);
  if (!match) return -Infinity;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return -Infinity;
  const unit = match[2]?.toUpperCase();
  if (unit === 'K') return num * 1000;
  if (unit === 'M') return num * 1000000;
  if (unit === 'B') return num * 1000000000;
  if (unit === 'G') return num * 1000000000;
  if (unit === 'T') return num * 1000000000000;
  return num;
};

const parseMemorySize = (val) => {
  if (val === null || val === undefined || val === 'N/A' || val === 'Unknown' || val === '-') return -Infinity;
  if (typeof val === 'number') return val;
  const str = String(val).trim();
  const match = str.match(/([\d.]+)\s*(MB|GB|TB|KB)?/i);
  if (!match) return -Infinity;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return -Infinity;
  const unit = (match[2] || 'GB').toUpperCase();
  if (unit === 'KB') return num / 1024;
  if (unit === 'MB') return num;
  if (unit === 'GB') return num * 1024;
  if (unit === 'TB') return num * 1024 * 1024;
  return num;
};

const parseBenchmarkScore = (val) => {
  if (val === null || val === undefined || val === '-' || val === 'N/A' || val === 'Unknown') return -Infinity;
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  return isNaN(num) ? -Infinity : num;
};

const ComparisonMatrix = ({ models = [], onDownload }) => {
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchFilter, setSearchFilter] = useState('');

  const safeModels = Array.isArray(models) ? models : [];

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredModels = useMemo(() => {
    if (!searchFilter.trim()) return safeModels;
    const query = searchFilter.toLowerCase().trim();
    return safeModels.filter(m => 
      (m?.name || '').toLowerCase().includes(query) ||
      (m?.type || '').toLowerCase().includes(query) ||
      (m?.params || '').toLowerCase().includes(query)
    );
  }, [safeModels, searchFilter]);

  const sortedModels = useMemo(() => {
    const list = [...filteredModels];
    list.sort((a, b) => {
      let valA, valB;

      switch (sortKey) {
        case 'name':
          valA = (a?.name || '').toLowerCase();
          valB = (b?.name || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'type':
          valA = (a?.type || '').toLowerCase();
          valB = (b?.type || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'params':
          valA = parseNumberWithSuffix(a?.params);
          valB = parseNumberWithSuffix(b?.params);
          break;
        case 'context':
          valA = parseNumberWithSuffix(a?.context);
          valB = parseNumberWithSuffix(b?.context);
          break;
        case 'memory':
          valA = parseMemorySize(a?.memory);
          valB = parseMemorySize(b?.memory);
          break;
        case 'mmlu':
          valA = parseBenchmarkScore(a?.scores?.mmlu);
          valB = parseBenchmarkScore(b?.scores?.mmlu);
          break;
        case 'math':
          valA = parseBenchmarkScore(a?.scores?.math);
          valB = parseBenchmarkScore(b?.scores?.math);
          break;
        case 'gsm8k':
          valA = parseBenchmarkScore(a?.scores?.gsm8k);
          valB = parseBenchmarkScore(b?.scores?.gsm8k);
          break;
        default:
          return 0;
      }

      if (valA === valB) return 0;
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return list;
  }, [filteredModels, sortKey, sortOrder]);

  const renderSortIndicator = (key) => {
    if (sortKey !== key) {
      return <i className="fas fa-sort text-gray-600 ml-1.5 opacity-50 group-hover:opacity-100 group-hover:text-cyan-400 transition-all text-[10px]"></i>;
    }
    return (
      <i className={`fas ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} text-cyan-400 ml-1.5 text-[10px]`}></i>
    );
  };

  const formatScorePill = (score) => {
    if (score === undefined || score === null || score === '-' || score === 'N/A') {
      return <span className="text-gray-600 font-mono text-xs">-</span>;
    }
    const num = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(num)) return <span className="text-gray-500 font-mono text-xs">{score}</span>;
    
    let colorClass = 'text-gray-300 bg-white/5 border-white/10';
    if (num >= 75) colorClass = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
    else if (num >= 60) colorClass = 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]';
    else if (num >= 40) colorClass = 'text-amber-300 bg-amber-500/15 border-amber-500/30';

    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${colorClass}`}>
        {num.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="mb-16 overflow-hidden bg-slate-950/70 border border-cyan-500/20 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl relative">
      {/* Top Bar */}
      <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> Comparison Matrix
            </h2>
            <span className="bg-cyan-500/10 text-cyan-300 text-xs px-3 py-0.5 rounded-full font-mono font-semibold border border-cyan-500/30">
              {sortedModels.length} {sortedModels.length === 1 ? 'model' : 'models'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Click on column headers to sort by parameters, context size, VRAM requirements, or benchmark scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60 text-xs"></i>
            <input 
              type="text"
              placeholder="Filter matrix..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-black/60 border border-cyan-500/20 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-slate-900/80 text-gray-400 text-[10px] uppercase tracking-widest font-bold border-b border-white/10 select-none">
              <th 
                onClick={() => handleSort('name')} 
                className="p-5 font-semibold cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center">
                  <span>Model Name</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('type')} 
                className="p-5 font-semibold cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center">
                  <span>Architecture</span>
                  {renderSortIndicator('type')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('params')} 
                className="p-5 font-semibold cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center">
                  <span>Params</span>
                  {renderSortIndicator('params')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('context')} 
                className="p-5 font-semibold cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center">
                  <span>Context</span>
                  {renderSortIndicator('context')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('memory')} 
                className="p-5 font-semibold cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center">
                  <span>VRAM Req.</span>
                  {renderSortIndicator('memory')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('mmlu')} 
                className="p-5 font-semibold text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center justify-center">
                  <span>MMLU</span>
                  {renderSortIndicator('mmlu')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('math')} 
                className="p-5 font-semibold text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center justify-center">
                  <span>MATH500</span>
                  {renderSortIndicator('math')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('gsm8k')} 
                className="p-5 font-semibold text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group"
              >
                <div className="flex items-center justify-center">
                  <span>GSM8K</span>
                  {renderSortIndicator('gsm8k')}
                </div>
              </th>
              <th className="p-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 divide-y divide-white/5">
            {sortedModels.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-gray-400 font-sans">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <i className="fas fa-search text-2xl text-cyan-500/40 mb-1"></i>
                    <p className="font-semibold text-white">No matching models found</p>
                    <p className="text-xs text-gray-500">Try adjusting your search filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedModels.map((model, i) => (
                <tr 
                  key={model.name || i} 
                  className={`hover:bg-cyan-950/20 transition-all duration-150 group ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                  }`}
                >
                  <td className="p-5 font-medium text-white tracking-wide font-sans">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] shrink-0"></span>
                      <span className="font-bold group-hover:text-cyan-300 transition-colors">{model.name || 'Unnamed Model'}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-400 font-light font-mono text-xs">
                    <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-cyan-300">
                      {model.type || 'General'}
                    </span>
                  </td>
                  <td className="p-5 text-gray-200 font-semibold font-mono text-xs">{model.params || 'N/A'}</td>
                  <td className="p-5 text-gray-400 font-light font-mono text-xs">{model.context || 'Unknown'}</td>
                  <td className="p-5 text-gray-400 font-light font-mono text-xs">{model.memory || 'Unknown'}</td>
                  <td className="p-5 text-center font-mono">{formatScorePill(model.scores?.mmlu)}</td>
                  <td className="p-5 text-center font-mono">{formatScorePill(model.scores?.math)}</td>
                  <td className="p-5 text-center font-mono">{formatScorePill(model.scores?.gsm8k)}</td>
                  <td className="p-5 text-right font-sans">
                    <button 
                      onClick={() => onDownload && onDownload(model)} 
                      className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-400 text-cyan-300 hover:text-black rounded-xl text-xs font-mono font-bold transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] tracking-wide inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <i className="fas fa-download text-[10px]"></i>
                      <span>Get Weights</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonMatrix;

