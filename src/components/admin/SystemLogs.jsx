import React, { useState, useEffect, useRef } from 'react';

const SystemLogs = ({ onToast = () => {} }) => {
  const initialLogs = [
    { id: 1, time: '04:32:01.012', level: 'INFO', module: 'cluster-daemon', msg: 'Heartbeat response received from 16/16 active compute nodes.' },
    { id: 2, time: '04:32:04.450', level: 'INFO', module: 'api-gateway', msg: 'POST /api/v1/inference/v2 200 OK - 24ms (ip: 192.168.1.104)' },
    { id: 3, time: '04:32:08.119', level: 'WARN', module: 'gpu-allocator', msg: 'VRAM usage on node-beta-02 exceeded 95% threshold (78/80 GB).' },
    { id: 4, time: '04:32:12.890', level: 'DEBUG', module: 'scheduler', msg: 'Evaluated job queue priority weights. JOB-9481 bumped to top.' },
    { id: 5, time: '04:32:15.302', level: 'ERROR', module: 'auth-service', msg: 'Failed authentication attempt for operator root from 185.220.101.4' },
    { id: 6, time: '04:32:19.914', level: 'INFO', module: 'storage-engine', msg: 'Checkpoint state committed to NVMe scratch drive. Checkpoint ID #ck-98421.' },
    { id: 7, time: '04:32:24.001', level: 'INFO', module: 'metrics-agent', msg: 'Prometheus metrics target scraped successfully.' }
  ];

  const [logs, setLogs] = useState(initialLogs);
  const [logLevel, setLogLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const logEndRef = useRef(null);

  // Auto stream simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      
      const modules = ['scheduler', 'gpu-allocator', 'api-gateway', 'auth-service', 'cluster-daemon', 'vector-index'];
      const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR'];
      const sampleMsgs = [
        'Ingressed 1,420 token embeddings into vector memory.',
        'Garbage collection completed in 4.2ms.',
        'API Key sk-live-...a1b9 rate limit check OK.',
        'Health check ping latency: 0.8ms.',
        'Model weights Llama-3 shard 4 synchronized.',
        'TCP connection socket pool recycled.'
      ];

      const idx = Math.floor(Math.random() * sampleMsgs.length);
      const newLog = {
        id: Date.now(),
        time: timeStr,
        level: levels[idx],
        module: modules[idx],
        msg: sampleMsgs[idx]
      };

      setLogs((prev) => [...prev.slice(-100), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Scroll to bottom when new logs arrive if streaming
  useEffect(() => {
    if (isStreaming && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isStreaming]);

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = logLevel === 'ALL' || l.level === logLevel;
    const matchesSearch =
      l.msg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleClear = () => {
    setLogs([]);
    onToast('Console logs cleared.');
  };

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level}] [${l.module}] ${l.msg}`).join('\n');
    navigator.clipboard.writeText(text);
    onToast('Logs copied to clipboard.');
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/20">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
            Telemetry // Audit Trail
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-terminal text-gray-300 text-2xl"></i> System Logs
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${
              isStreaming
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-black text-gray-400 border-white/20 hover:text-white'
            }`}
          >
            <i className={`fas ${isStreaming ? 'fa-pause' : 'fa-play'}`}></i>
            {isStreaming ? 'Pause Stream' : 'Resume Stream'}
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white/[0.03] border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        {/* Log Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLogLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                logLevel === lvl
                  ? 'bg-white text-black shadow-md'
                  : 'bg-black text-gray-400 border border-white/20 hover:text-white hover:border-white/50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search & Utility Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              id="admin-system-logs-search"
              name="systemLogsSearch"
              aria-label="Filter logs by message or module"
              type="text"
              placeholder="Search log stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-white focus:outline-none transition-all font-mono"
            />
          </div>
          <button
            onClick={handleCopyLogs}
            title="Copy Logs"
            className="p-2.5 bg-black hover:bg-white/10 border border-white/20 text-gray-300 hover:text-white rounded-xl transition-colors text-xs"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            onClick={handleClear}
            title="Clear Console"
            className="p-2.5 bg-black hover:bg-white/10 border border-white/20 text-gray-300 hover:text-white rounded-xl transition-colors text-xs"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {/* Terminal View Component */}
      <div className="bg-white/[0.03] border border-white/20 rounded-2xl p-4 shadow-md">
        {/* Terminal Header */}
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/20 text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></span>
            <span className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></span>
            <span className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></span>
            <span className="ml-2 font-bold text-gray-200">tty1 // live-stdout</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Buffer: {filteredLogs.length} events</span>
            <span className="inline-flex items-center gap-1.5 text-gray-200 font-bold">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-white animate-pulse' : 'bg-gray-500'}`}></span>
              {isStreaming ? 'LIVE STREAM' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Log Lines Output */}
        <div className="h-[450px] overflow-y-auto space-y-2 p-3 bg-black rounded-xl border border-white/20 font-mono text-xs select-text shadow-inner">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 p-1.5 rounded transition-colors leading-relaxed">
                <span className="text-gray-400 text-[11px] shrink-0 font-mono">{log.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                    log.level === 'ERROR'
                      ? 'bg-white text-black font-bold'
                      : log.level === 'WARN'
                      ? 'bg-white/20 text-white border border-white/40'
                      : log.level === 'INFO'
                      ? 'bg-white/10 text-gray-200 border border-white/20'
                      : 'bg-black text-gray-400 border border-white/10'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-gray-300 font-bold shrink-0">[{log.module}]</span>
                <span className="text-gray-200 break-all">{log.msg}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 font-mono">
              Console buffer is empty or no log matches query.
            </div>
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
