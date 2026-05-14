import React from 'react';
import { History, Search, Filter, Shield, Activity, Clock, Download, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

const Timeline = () => {
  const historyData = [
    { id: 'VC-8912', name: 'payload_x7.exe', type: 'Malware Scan', date: '2026-05-11 14:20', threat: 'High', score: 84 },
    { id: 'VC-8911', name: 'capture_office_vlan.pcap', type: 'Network Scan', date: '2026-05-11 12:05', threat: 'Low', score: 12 },
    { id: 'VC-8910', name: 'memory_dump_node_01.raw', type: 'RAM Analysis', date: '2026-05-10 18:45', threat: 'Critical', score: 98 },
    { id: 'VC-8909', name: 'suspicious_script.ps1', type: 'Malware Scan', date: '2026-05-10 16:30', threat: 'Medium', score: 56 },
    { id: 'VC-8908', name: 'gateway_traffic_log.csv', type: 'Network Scan', date: '2026-05-10 10:15', threat: 'None', score: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Forensic History</h2>
          <p className="text-slate-400 text-sm">Review past analysis reports and investigation logs.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by ID or Filename..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs w-64 focus:outline-none focus:border-primary/50"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Case ID</th>
              <th className="px-6 py-4">Artifact Name</th>
              <th className="px-6 py-4">Scan Type</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Threat Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {historyData.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-all group">
                <td className="px-6 py-4 text-xs font-mono text-primary font-bold">{item.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200">{item.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">8.2 MB</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          item.score > 70 ? "bg-danger" : item.score > 40 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase italic",
                      item.score > 70 ? "bg-danger" : item.score > 40 ? "bg-warning" : "bg-success"
                    )}>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-primary transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">1,254</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Scans Conducted</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">42</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Threats Detected</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">99.8%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analysis Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
