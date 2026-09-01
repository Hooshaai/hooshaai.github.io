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
      return <i className="fas fa-sort text-slate-600 ml-1.5 opacity-40 group-hover:opacity-100 group-hover:text-cyan-400 transition-all text-[10px]"></i>;
    }
    return (
      <i className={`fas ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} text-cyan-400 ml-1.5 text-[10px]`}></i>
    );
  };

  const formatScorePill = (score) => {
    if (score === undefined || score === null || score === '-' || score === 'N/A') {
      return <span className="text-slate-600 font-mono text-xs">-</span>;
    }
    const num = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(num)) return <span className="text-slate-400 font-mono text-xs">{score}</span>;
    
    let colorClass = 'text-slate-300 bg-white/5 border-white/10';
    if (num >= 75) colorClass = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
    else if (num >= 60) colorClass = 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30';
    else if (num >= 40) colorClass = 'text-amber-300 bg-amber-500/15 border-amber-500/30';

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${colorClass}`}>
        {num.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="mb-14 overflow-hidden bg-slate-900/60 border border-slate-800/90 rounded-2xl shadow-xl backdrop-blur-xl relative">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> Benchmark Matrix
            </h2>
            <span className="bg-cyan-500/10 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border border-cyan-500/30">
              {sortedModels.length} models
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Interactive benchmark comparisons and resource requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-60">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60 text-xs"></i>
            <input 
              type="text"
              placeholder="Filter matrix..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs whitespace-nowrap">
          <thead>
            <tr className="bg-slate-950/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-800 select-none">
              <th onClick={() => handleSort('name')} className="py-3.5 px-4 cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center">
                  <span>Model Name</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th onClick={() => handleSort('type')} className="py-3.5 px-4 cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center">
                  <span>Architecture</span>
                  {renderSortIndicator('type')}
                </div>
              </th>
              <th onClick={() => handleSort('params')} className="py-3.5 px-4 cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center">
                  <span>Params</span>
                  {renderSortIndicator('params')}
                </div>
              </th>
              <th onClick={() => handleSort('context')} className="py-3.5 px-4 cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center">
                  <span>Context</span>
                  {renderSortIndicator('context')}
                </div>
              </th>
              <th onClick={() => handleSort('memory')} className="py-3.5 px-4 cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center">
                  <span>VRAM</span>
                  {renderSortIndicator('memory')}
                </div>
              </th>
              <th onClick={() => handleSort('mmlu')} className="py-3.5 px-4 text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center justify-center">
                  <span>MMLU</span>
                  {renderSortIndicator('mmlu')}
                </div>
              </th>
              <th onClick={() => handleSort('math')} className="py-3.5 px-4 text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center justify-center">
                  <span>MATH</span>
                  {renderSortIndicator('math')}
                </div>
              </th>
              <th onClick={() => handleSort('gsm8k')} className="py-3.5 px-4 text-center cursor-pointer hover:bg-white/5 hover:text-cyan-300 transition-colors group">
                <div className="flex items-center justify-center">
                  <span>GSM8K</span>
                  {renderSortIndicator('gsm8k')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 divide-y divide-slate-800/60">
            {sortedModels.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400 font-sans">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <i className="fas fa-search text-xl text-cyan-500/40 mb-1"></i>
                    <p className="font-semibold text-white text-xs">No matching models found</p>
                    <p className="text-[11px] text-slate-500">Try adjusting your filter search.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedModels.map((model, i) => (
                <tr 
                  key={model.name || i} 
                  className="hover:bg-cyan-950/20 transition-colors duration-150"
                >
                  <td className="py-3 px-4 font-medium text-white font-sans text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                      <span className="font-bold hover:text-cyan-300 transition-colors">{model.name || 'Unnamed Model'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-300 text-[11px]">
                      {model.type || 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-bold text-xs">{model.params || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{model.context || 'Unknown'}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{model.memory || 'Unknown'}</td>
                  <td className="py-3 px-4 text-center">{formatScorePill(model.scores?.mmlu)}</td>
                  <td className="py-3 px-4 text-center">{formatScorePill(model.scores?.math)}</td>
                  <td className="py-3 px-4 text-center">{formatScorePill(model.scores?.gsm8k)}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button 
                      onClick={() => onDownload && onDownload(model)} 
                      className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] inline-flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <i className="fas fa-download text-[9px]"></i>
                      <span>Get</span>
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
