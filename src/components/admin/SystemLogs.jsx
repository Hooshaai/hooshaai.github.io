import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Download, Copy, Trash2, AlertTriangle, Bug, Activity, Check } from 'lucide-react';

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
  const [streamRate, setStreamRate] = useState(2500);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  const logEndRef = useRef(null);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr =
        now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

      const modules = ['scheduler', 'gpu-allocator', 'api-gateway', 'auth-service', 'cluster-daemon', 'vector-index'];
      const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR'];
      const sampleMsgs = [
        'Ingressed 1,420 token embeddings into vector memory index.',
        'Garbage collection and page table sync completed in 4.2ms.',
        'API Key sk-live-...a1b9 rate limit quota check PASSED.',
        'Health check ping latency to node-alpha-01: 0.8ms.',
        'Model weights Llama-3 shard 4 synchronized over NVLink.',
        'TCP socket connection pool recycled for worker node-beta-01.'
      ];

      const idx = Math.floor(Math.random() * sampleMsgs.length);
      const newLog = {
        id: Date.now() + Math.random(),
        time: timeStr,
        level: levels[idx],
        module: modules[idx],
        msg: sampleMsgs[idx]
      };

      setLogs((prev) => [...prev.slice(-150), newLog]);
    }, streamRate);

    return () => clearInterval(interval);
  }, [isStreaming, streamRate]);

  useEffect(() => {
    if (autoScroll && isStreaming && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, isStreaming]);

  const triggerErrorEvent = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const errLog = {
      id: Date.now(),
      time: timeStr,
      level: 'ERROR',
      module: 'gpu-allocator',
      msg: 'CUDA OOM (Out Of Memory) Exception on node-beta-02 during FP8 kernel execution! Free VRAM: 12MB / Total: 81920MB.'
    };
    setLogs((prev) => [...prev, errLog]);
    onToast('Simulated CUDA OOM Error Event injected.');
  };

  const triggerWarnEvent = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const warnLog = {
      id: Date.now(),
      time: timeStr,
      level: 'WARN',
      module: 'thermal-daemon',
      msg: 'Thermal throttling warning on node-alpha-02 GPU #3: Core temperature reached 79.5°C.'
    };
    setLogs((prev) => [...prev, warnLog]);
    onToast('Simulated Thermal Warning Event injected.');
  };

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = logLevel === 'ALL' || l.level === logLevel;
    const matchesSearch =
      l.msg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const levelCounts = {
    ALL: logs.length,
    INFO: logs.filter((l) => l.level === 'INFO').length,
    WARN: logs.filter((l) => l.level === 'WARN').length,
    ERROR: logs.filter((l) => l.level === 'ERROR').length,
    DEBUG: logs.filter((l) => l.level === 'DEBUG').length
  };

  const handleClear = () => {
    setLogs([]);
    onToast('Console logs cleared.');
  };

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level}] [${l.module}] ${l.msg}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Logs copied to clipboard.');
  };

  const handleExportLogs = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level}] [${l.module}] ${l.msg}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_logs_${Date.now()}.log`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast('Log buffer exported to file.');
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">
            Telemetry // Real-Time Audit Trail
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <Terminal className="w-7 h-7 text-cyan-400" /> System Log Streaming
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
              isStreaming
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-cyan-400 animate-ping' : 'bg-zinc-600'}`}></span>
            {isStreaming ? 'Streaming Live' : 'Stream Paused'}
          </button>

          <select
            value={streamRate}
            onChange={(e) => setStreamRate(Number(e.target.value))}
            className="bg-zinc-900/90 text-zinc-200 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value={1000}>Fast (1.0s)</option>
            <option value={2500}>Normal (2.5s)</option>
            <option value={5000}>Slow (5.0s)</option>
          </select>
        </div>
      </div>

      {/* Simulators Bar */}
      <div className="flex flex-wrap items-center justify-between bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 gap-4 shadow-xl">
        <div className="text-xs font-bold text-zinc-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Event Simulators:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={triggerWarnEvent}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Thermal Warn Event
          </button>
          <button
            onClick={triggerErrorEvent}
            className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" /> Inject CUDA OOM Error
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        {/* Log Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLogLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                logLevel === lvl
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{lvl}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${logLevel === lvl ? 'bg-black text-cyan-300 font-bold' : 'bg-zinc-800 text-zinc-300'}`}>
                {levelCounts[lvl]}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="admin-system-logs-search"
              name="systemLogsSearch"
              aria-label="Filter logs by message or module"
              type="text"
              placeholder="Search log stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/90 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-all font-mono"
            />
          </div>

          <button
            onClick={handleExportLogs}
            title="Download Log File"
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-cyan-300 rounded-xl transition-colors text-xs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLogs}
            title="Copy Logs"
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-cyan-300 rounded-xl transition-colors text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleClear}
            title="Clear Console"
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-rose-400 rounded-xl transition-colors text-xs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cyberpunk Terminal Window */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Terminal Top Window Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 mb-3 border-b border-zinc-800/80 text-[11px] text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-bold text-cyan-300 font-mono">tty1 // live-stdout</span>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none text-zinc-400">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-zinc-800 bg-black text-cyan-400 focus:ring-0"
              />
              Auto-scroll
            </label>
            <span className="text-cyan-200/80 font-bold">Buffer: {filteredLogs.length} events</span>
          </div>
        </div>

        {/* Log Stream Box */}
        <div className="h-[460px] overflow-y-auto space-y-2 p-3 bg-black/95 rounded-2xl border border-zinc-800/90 font-mono text-xs select-text shadow-inner">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 hover:bg-zinc-900/60 p-1.5 rounded-lg transition-colors leading-relaxed">
                <span className="text-zinc-500 text-[11px] shrink-0 font-mono">{log.time}</span>
                
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 border ${
                    log.level === 'ERROR'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                      : log.level === 'WARN'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : log.level === 'INFO'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}
                >
                  {log.level}
                </span>

                <span className="text-cyan-400 font-bold shrink-0">[{log.module}]</span>
                <span className="text-zinc-200 break-all">{log.msg}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-24 text-zinc-500 font-mono">
              Log buffer is empty or no lines match current filter query.
            </div>
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
