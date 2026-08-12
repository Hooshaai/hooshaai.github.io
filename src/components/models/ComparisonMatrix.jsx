const ComparisonMatrix = ({ models, onDownload }) => {
  return (
    <div className="mb-24 overflow-hidden bg-white/[0.02] border border-white/10 rounded-3xl">
      <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] tracking-tight text-white">Comparison Matrix</h2>
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <i className="fas fa-chart-bar text-gray-400 text-sm"></i>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-black/20 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-6 font-semibold">Model Name</th>
              <th className="p-6 font-semibold">Params</th>
              <th className="p-6 font-semibold">Context</th>
              <th className="p-6 font-semibold">Memory</th>
              <th className="p-6 font-semibold text-center">MMLU</th>
              <th className="p-6 font-semibold text-center">MATH500</th>
              <th className="p-6 font-semibold text-center">GSM8K</th>
              <th className="p-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {models.map((model, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                <td className="p-6 font-medium text-white flex items-center gap-3 tracking-wide">
                  {model.name}
                </td>
                <td className="p-6 text-gray-400 font-light">{model.params}</td>
                <td className="p-6 text-gray-400 font-light">{model.context}</td>
                <td className="p-6 text-gray-400 font-light">{model.memory}</td>
                <td className="p-6 text-center text-gray-200">{model.scores.mmlu}</td>
                <td className="p-6 text-center text-gray-200">{model.scores.math}</td>
                <td className="p-6 text-center text-gray-200">{model.scores.gsm8k}</td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => onDownload(model)} 
                    className="px-4 py-2 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg text-xs font-medium transition-all duration-300 border border-white/10 hover:border-transparent tracking-wide"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonMatrix;
