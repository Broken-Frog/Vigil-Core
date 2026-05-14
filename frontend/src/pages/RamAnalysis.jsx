import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  Play, 
  ChevronRight, 
  Binary, 
  Network, 
  Layers, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const RamAnalysis = () => {
  const [selectedDump, setSelectedDump] = useState('memory_dump_2026_05_11.raw');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [options, setOptions] = useState({
    processList: true,
    networkConns: true,
    dllList: false,
    registry: false,
    strings: false
  });

  const toggleOption = (opt) => {
    setOptions({...options, [opt]: !options[opt]});
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const mockProcesses = [
    { pid: 420, name: 'svchost.exe', path: 'C:\\Windows\\System32', suspicious: false },
    { pid: 1532, name: 'explorer.exe', path: 'C:\\Windows', suspicious: false },
    { pid: 3044, name: 'wininit.exe', path: 'C:\\Windows\\System32', suspicious: false },
    { pid: 8812, name: 'unknown_v3.exe', path: 'C:\\Users\\Admin\\AppData\\Local\\Temp', suspicious: true },
    { pid: 442, name: 'lsass.exe', path: 'C:\\Windows\\System32', suspicious: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-white tracking-tight">RAM Analysis</h2>
          <p className="text-slate-400 text-sm">Extract volatile artifacts from system memory dumps.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono text-primary font-bold">VOLATILITY 3 ENGINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Select Image</h3>
            <div className="relative">
              <select 
                value={selectedDump}
                onChange={(e) => setSelectedDump(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all text-slate-200"
              >
                <option value="memory_dump_2026_05_11.raw">memory_dump_2026_05_11.raw</option>
                <option value="workstation_alpha.mem">workstation_alpha.mem</option>
                <option value="server_bk_01.raw">server_bk_01.raw</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Analysis Modules</h3>
            <div className="space-y-3">
              {[
                { id: 'processList', label: 'Process List', icon: Layers },
                { id: 'networkConns', label: 'Network Connections', icon: Network },
                { id: 'dllList', label: 'DLL Inventory', icon: Binary },
                { id: 'registry', label: 'Registry Artifacts', icon: FileText },
                { id: 'strings', label: 'Suspicious Strings', icon: Search },
              ].map((mod) => (
                <button 
                  key={mod.id}
                  onClick={() => toggleOption(mod.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    options[mod.id] 
                      ? 'bg-primary/5 border-primary/30 text-primary' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <mod.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{mod.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    options[mod.id] ? 'border-primary bg-primary' : 'border-slate-700'
                  }`}>
                    {options[mod.id] && <CheckCircle2 className="w-3 h-3 text-background" />}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full mt-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isAnalyzing 
                  ? 'bg-slate-800 text-slate-500' 
                  : 'bg-primary text-background hover:bg-accent shadow-primary/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex gap-1">
                {['Processes', 'Network', 'DLLs', 'Handles', 'Malware'].map((tab, i) => (
                  <button 
                    key={tab}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                      i === 0 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Filter table..." 
                    className="bg-background/50 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:border-primary/50 w-48"
                  />
                </div>
                <button className="p-2 text-slate-400 hover:text-white transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4">PID</th>
                    <th className="px-6 py-4">Process Name</th>
                    <th className="px-6 py-4">Path</th>
                    <th className="px-6 py-4 text-center">Threat Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockProcesses.map((proc) => (
                    <tr key={proc.pid} className="hover:bg-white/5 transition-all group">
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">{proc.pid}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-200">{proc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono">{proc.path}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {proc.suspicious ? (
                            <div className="px-3 py-1 rounded-full bg-danger/10 border border-danger/30 flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3 text-danger" />
                              <span className="text-[10px] font-bold text-danger uppercase tracking-wider">Suspicious</span>
                            </div>
                          ) : (
                            <div className="px-3 py-1 rounded-full bg-success/10 border border-success/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-success" />
                              <span className="text-[10px] font-bold text-success uppercase tracking-wider">Clean</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Showing 5 processes from dump workstation_alpha.mem</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-white/10 text-xs text-slate-400 hover:bg-white/5 disabled:opacity-30">Prev</button>
                <button className="px-3 py-1 rounded border border-white/10 text-xs text-slate-400 hover:bg-white/5">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamAnalysis;
