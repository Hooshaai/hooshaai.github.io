import React, { useState } from 'react';

const NodeManagement = ({ onToast = () => {} }) => {
  const [nodes, setNodes] = useState([
    {
      id: 'node-alpha-01',
      role: 'Master Orchestrator',
      status: 'ONLINE',
      cpu: 42,
      gpu: 88,
      vram: '72 / 80 GB',
      mem: '128 / 256 GB',
      temp: '64°C',
      power: '340W',
      ip: '10.0.4.12'
    },
    {
      id: 'node-alpha-02',
      role: 'Inference Worker',
      status: 'ONLINE',
      cpu: 68,
      gpu: 94,
      vram: '78 / 80 GB',
      mem: '180 / 256 GB',
      temp: '71°C',
      power: '410W',
      ip: '10.0.4.13'
    },
    {
      id: 'node-beta-01',
      role: 'Vector Indexer',
      status: 'ONLINE',
      cpu: 24,
      gpu: 30,
      vram: '24 / 80 GB',
      mem: '96 / 128 GB',
      temp: '52°C',
      power: '210W',
      ip: '10.0.5.20'
    },
    {
      id: 'node-beta-02',
      role: 'Fine-Tuning Worker',
      status: 'BUSY',
      cpu: 96,
      gpu: 99,
      vram: '80 / 80 GB',
      mem: '240 / 256 GB',
      temp: '78°C',
      power: '450W',
      ip: '10.0.5.21'
    },
    {
      id: 'node-gamma-01',
      role: 'Data Pipeline',
      status: 'IDLE',
      cpu: 8,
      gpu: 0,
      vram: '4 / 80 GB',
      mem: '32 / 128 GB',
      temp: '41°C',
      power: '120W',
      ip: '10.0.6.05'
    },
    {
      id: 'node-gamma-02',
      role: 'Standby / Maintenance',
      status: 'MAINTENANCE',
      cpu: 0,
      gpu: 0,
      vram: '0 / 80 GB',
      mem: '16 / 128 GB',
      temp: '35°C',
      power: '45W',
      ip: '10.0.6.06'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = nodes.filter((n) => {
    const matchesFilter = filterStatus === 'ALL' || n.status === filterStatus;
    const matchesSearch =
      n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.ip.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleAction = (nodeId, action) => {
    if (action === 'Restart') {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'IDLE', cpu: 5, gpu: 0 } : n))
      );
      onToast(`Node ${nodeId} restart signal sent.`);
    } else if (action === 'Drain') {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'MAINTENANCE' } : n))
      );
      onToast(`Node ${nodeId} set to maintenance/drain state.`);
    } else if (action === 'Activate') {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'ONLINE', cpu: 35, gpu: 50 } : n))
      );
      onToast(`Node ${nodeId} activated successfully.`);
    }
  };

  const handleAddNode = () => {
    const newId = `node-custom-0${nodes.length + 1}`;
    const newNode = {
      id: newId,
      role: 'Dynamic Compute Worker',
      status: 'ONLINE',
      cpu: 15,
      gpu: 20,
      vram: '16 / 80 GB',
      mem: '64 / 256 GB',
      temp: '48°C',
      power: '180W',
      ip: `10.0.7.${10 + nodes.length}`
    };
    setNodes((prev) => [...prev, newNode]);
    onToast(`Provisioned new node: ${newId}`);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/20">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
            Infrastructure // Compute Topology
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-server text-gray-300 text-2xl"></i> Node Management
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNode}
            className="px-4 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-md flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Provision Node
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Nodes</div>
          <div className="text-2xl font-bold text-white mt-1">{nodes.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Active Workers</div>
          <div className="text-2xl font-bold text-white mt-1">
            {nodes.filter((n) => n.status === 'ONLINE' || n.status === 'BUSY').length}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Avg Temp</div>
          <div className="text-2xl font-bold text-white mt-1">59°C</div>
        </div>
        <div className="bg-white/[0.03] border border-white/20 p-4 rounded-xl shadow-md">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Aggregate VRAM</div>
          <div className="text-2xl font-bold text-white mt-1">276 / 480 GB</div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white/[0.03] border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'ONLINE', 'BUSY', 'IDLE', 'MAINTENANCE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                filterStatus === st
                  ? 'bg-white text-black shadow-md'
                  : 'bg-black text-gray-400 border border-white/20 hover:text-white hover:border-white/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            id="admin-node-search"
            name="nodeSearch"
            aria-label="Filter nodes by ID, role or IP"
            type="text"
            placeholder="Filter node ID, role, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-white focus:outline-none transition-all font-mono"
          />
        </div>
      </div>

      {/* Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNodes.map((node) => {
          const isMaintenance = node.status === 'MAINTENANCE';
          return (
            <div
              key={node.id}
              className="bg-white/[0.03] border border-white/20 hover:border-white/50 transition-all rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Node Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-bold text-white font-mono tracking-wider">{node.id}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{node.role}</div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      node.status === 'ONLINE'
                        ? 'bg-white text-black border-white'
                        : node.status === 'BUSY'
                        ? 'bg-white/10 text-white border-white/30 font-bold'
                        : node.status === 'IDLE'
                        ? 'bg-black text-gray-300 border-white/20'
                        : 'bg-black text-gray-500 border-white/10'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="text-[10px] text-gray-400 mb-4 tracking-widest uppercase">
                  IP: <span className="text-gray-200 font-bold">{node.ip}</span>
                </div>

                {/* Utilization Progress Bars */}
                <div className="space-y-3 pt-3 border-t border-white/20">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                      <span className="text-gray-400 uppercase">CPU Usage</span>
                      <span className="text-white">{node.cpu}%</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/20">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{ width: `${node.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* GPU Utilization */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                      <span className="text-gray-400 uppercase">GPU Load</span>
                      <span className="text-white">{node.gpu}%</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/20">
                      <div
                        className="bg-gray-300 h-full transition-all duration-500"
                        style={{ width: `${node.gpu}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-[10px]">
                  <div>
                    <span className="text-gray-400 block uppercase">VRAM</span>
                    <span className="text-gray-200 font-bold">{node.vram}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase">RAM</span>
                    <span className="text-gray-200 font-bold">{node.mem}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase">Temp</span>
                    <span className="text-gray-200 font-bold">{node.temp}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase">Power Draw</span>
                    <span className="text-gray-200 font-bold">{node.power}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20">
                {isMaintenance ? (
                  <button
                    onClick={() => handleAction(node.id, 'Activate')}
                    className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors shadow-md"
                  >
                    <i className="fas fa-play mr-1"></i> Activate Node
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(node.id, 'Restart')}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      <i className="fas fa-redo mr-1"></i> Restart
                    </button>
                    <button
                      onClick={() => handleAction(node.id, 'Drain')}
                      className="flex-1 py-2 bg-black hover:bg-white/5 border border-white/20 text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      <i className="fas fa-pause mr-1"></i> Drain
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeManagement;
