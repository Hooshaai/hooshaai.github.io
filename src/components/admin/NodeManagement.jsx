import React, { useState, useEffect } from 'react';

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
      temp: 64,
      power: 340,
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
      temp: 71,
      power: 410,
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
      temp: 52,
      power: 210,
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
      temp: 78,
      power: 450,
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
      temp: 41,
      power: 120,
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
      temp: 35,
      power: 45,
      ip: '10.0.6.06'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newNodeRole, setNewNodeRole] = useState('Compute Worker');
  const [selectedNode, setSelectedNode] = useState(null);

  // Periodic metric fluctuation for active nodes
  useEffect(() => {
    const id = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.status === 'MAINTENANCE' || n.status === 'IDLE') return n;
          const cpuDelta = (Math.random() - 0.5) * 6;
          const gpuDelta = (Math.random() - 0.5) * 4;
          const tempDelta = (Math.random() - 0.5) * 1.2;

          return {
            ...n,
            cpu: Math.min(100, Math.max(10, Math.round(n.cpu + cpuDelta))),
            gpu: Math.min(100, Math.max(10, Math.round(n.gpu + gpuDelta))),
            temp: Math.min(90, Math.max(40, Math.round((n.temp + tempDelta) * 10) / 10)),
            power: Math.min(650, Math.max(150, Math.round(n.power + (Math.random() - 0.5) * 15)))
          };
        })
      );
    }, 2000);

    return () => clearInterval(id);
  }, []);

  const getThermalBadge = (temp) => {
    if (temp >= 76) return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
    if (temp >= 62) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  };

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
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'MAINTENANCE', cpu: 0, gpu: 0 } : n))
      );
      onToast(`Node ${nodeId} set to maintenance/drain state.`);
    } else if (action === 'Activate') {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'ONLINE', cpu: 35, gpu: 50 } : n))
      );
      onToast(`Node ${nodeId} activated successfully.`);
    }
  };

  const handleProvisionSubmit = (e) => {
    e.preventDefault();
    const newId = `node-custom-0${nodes.length + 1}`;
    const newNode = {
      id: newId,
      role: newNodeRole,
      status: 'ONLINE',
      cpu: 15,
      gpu: 20,
      vram: '16 / 80 GB',
      mem: '64 / 256 GB',
      temp: 48,
      power: 180,
      ip: `10.0.7.${10 + nodes.length}`
    };
    setNodes((prev) => [...prev, newNode]);
    setShowProvisionModal(false);
    onToast(`Provisioned new compute node: ${newId}`);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
            Infrastructure // Compute Topology
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-server text-zinc-300 text-xl"></i> Node Management
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Provision Node
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Nodes</div>
          <div className="text-2xl font-bold text-white mt-1">{nodes.length}</div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Active Workers</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {nodes.filter((n) => n.status === 'ONLINE' || n.status === 'BUSY').length}
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Avg Temp</div>
          <div className="text-2xl font-bold text-white mt-1">
            {(nodes.reduce((acc, n) => acc + n.temp, 0) / nodes.length).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Aggregate VRAM</div>
          <div className="text-2xl font-bold text-white mt-1">276 / 480 GB</div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'ONLINE', 'BUSY', 'IDLE', 'MAINTENANCE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                filterStatus === st
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
          <input
            id="admin-node-search"
            name="nodeSearch"
            aria-label="Filter nodes by ID, role or IP"
            type="text"
            placeholder="Filter node ID, role, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-all font-mono"
          />
        </div>
      </div>

      {/* Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNodes.map((node) => {
          const isMaintenance = node.status === 'MAINTENANCE';
          const thermalBadge = getThermalBadge(node.temp);

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl p-5 shadow-xl flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Node Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-bold text-white font-mono tracking-wider">{node.id}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{node.role}</div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      node.status === 'ONLINE'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : node.status === 'BUSY'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : node.status === 'IDLE'
                        ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-500 mb-4 tracking-widest uppercase">
                  IP: <span className="text-zinc-300 font-bold">{node.ip}</span>
                </div>

                {/* Utilization Progress Bars */}
                <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                      <span className="text-zinc-400 uppercase">CPU Usage</span>
                      <span className="text-white">{node.cpu}%</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{ width: `${node.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* GPU Utilization */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                      <span className="text-zinc-400 uppercase">GPU Load</span>
                      <span className="text-white">{node.gpu}%</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-500"
                        style={{ width: `${node.gpu}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-[10px]">
                  <div>
                    <span className="text-zinc-500 block uppercase">VRAM</span>
                    <span className="text-zinc-200 font-bold">{node.vram}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase">RAM</span>
                    <span className="text-zinc-200 font-bold">{node.mem}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase">Temp</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded border ${thermalBadge}`}>
                      {node.temp}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase">Power Draw</span>
                    <span className="text-zinc-200 font-bold">{node.power}W</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800/80" onClick={(e) => e.stopPropagation()}>
                {isMaintenance ? (
                  <button
                    onClick={() => handleAction(node.id, 'Activate')}
                    className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    <i className="fas fa-play mr-1"></i> Activate Node
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(node.id, 'Restart')}
                      className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors"
                    >
                      <i className="fas fa-redo mr-1"></i> Restart
                    </button>
                    <button
                      onClick={() => handleAction(node.id, 'Drain')}
                      className="flex-1 py-2 bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors"
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

      {/* Provision Node Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <i className="fas fa-server text-zinc-300"></i> Provision Dynamic Compute Node
              </h3>
              <button onClick={() => setShowProvisionModal(false)} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                  Node Role / Workload Assignment
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Trainer"
                  value={newNodeRole}
                  onChange={(e) => setNewNodeRole(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Node Details Inspector Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative font-mono">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Node Diagnostics — {selectedNode.id}
                </h3>
                <p className="text-xs text-zinc-400">Role: {selectedNode.role} • IP: {selectedNode.ip}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-zinc-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Node Status</span>
                <span className="font-bold text-white">{selectedNode.status}</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">CPU Load</span>
                <span className="font-bold text-white">{selectedNode.cpu}%</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">GPU Utilization</span>
                <span className="font-bold text-white">{selectedNode.gpu}%</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Temperature</span>
                <span className="font-bold text-white">{selectedNode.temp}°C</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeManagement;
