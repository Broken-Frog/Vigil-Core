import React, { useState } from 'react';
import { 
  Network, 
  Upload, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  Globe, 
  ShieldAlert,
  Server,
  Terminal,
  Activity
} from 'lucide-react';

const NetworkForensics = () => {
  const [activeTab, setActiveTab] = useState('traffic');

  const trafficData = [
    { time: '10:01:45', source: '192.168.1.105', dest: '45.33.22.11', proto: 'HTTPS', size: '2.4 KB', threat: 'Low' },
    { time: '10:02:12', source: '192.168.1.105', dest: '104.22.1.8', proto: 'DNS', size: '156 B', threat: 'Low' },
    { time: '10:05:30', source: '192.168.1.201', dest: '185.122.11.4', proto: 'TCP', size: '1.2 MB', threat: 'High' },
    { time: '10:08:11', source: '10.0.0.5', dest: '8.8.8.8', proto: 'DNS', size: '98 B', threat: 'Low' },
    { time: '10:12:44', source: '192.168.1.105', dest: '192.168.1.1', proto: 'ICMP', size: '64 B', threat: 'None' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-white tracking-tight">Network Forensics</h2>
          <p className="text-slate-400 text-sm">Analyze PCAP files and live traffic for malicious patterns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary/50 rounded-xl transition-all">
          <Upload className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Upload PCAP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 h-fit">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            Traffic Filters
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP Address</label>
              <input type="text" placeholder="192.168.x.x" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-slate-400">
                <option>All Protocols</option>
                <option>TCP</option>
                <option>UDP</option>
                <option>HTTP/S</option>
                <option>DNS</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Port Range</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Start" className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                <input type="text" placeholder="End" className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <button className="w-full py-3 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-background transition-all mt-4">
              Apply Filters
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Packets', value: '12,450', icon: Activity, color: 'text-primary' },
              { label: 'Unique Hosts', value: '42', icon: Server, color: 'text-success' },
              { label: 'Threat Alerts', value: '8', icon: ShieldAlert, color: 'text-danger' },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('traffic')}
                  className={`text-xs font-bold uppercase tracking-widest pb-1 transition-all ${activeTab === 'traffic' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Traffic Table
                </button>
                <button 
                  onClick={() => setActiveTab('graph')}
                  className={`text-xs font-bold uppercase tracking-widest pb-1 transition-all ${activeTab === 'graph' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Connection Graph
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span className="text-[10px] font-mono text-slate-600 uppercase">Live Export Mode</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Source IP</th>
                    <th className="px-6 py-4 text-center"><ArrowRightLeft className="w-3 h-3 mx-auto" /></th>
                    <th className="px-6 py-4">Destination IP</th>
                    <th className="px-6 py-4">Proto</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Threat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trafficData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all">
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{row.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                          <span className="text-sm font-medium text-slate-200">{row.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        <ArrowRightLeft className="w-3 h-3 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-200">{row.dest}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400">{row.proto}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{row.size}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          row.threat === 'High' ? 'text-danger' : row.threat === 'Low' ? 'text-warning' : 'text-success'
                        }`}>
                          {row.threat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-12 flex flex-col items-center justify-center border-t border-white/5 bg-background/30">
              <Globe className="w-12 h-12 text-white/5 mb-4" />
              <p className="text-xs text-slate-600 font-medium">End of captured packet stream</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkForensics;
