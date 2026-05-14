import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Upload, 
  Search, 
  Loader2, 
  Globe, 
  ShieldAlert,
  Server,
  Terminal,
  Activity,
  ArrowRightLeft,
  Filter,
  BarChart as BarIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { cn } from '../utils/cn';
import axios from 'axios';

const NetworkScan = () => {
  const [state, setState] = useState('idle'); // idle, uploading, scanning, result, error
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Artifacts data
  const [attackStory, setAttackStory] = useState('');
  const [hostProfiles, setHostProfiles] = useState(null);
  const [incidents, setIncidents] = useState(null);
  const [stats, setStats] = useState(null);
  const [iocs, setIocs] = useState([]);
  const [liveLog, setLiveLog] = useState('');
  const [chartData, setChartData] = useState({ protocols: [], services: [], ports: [] });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const startAnalysis = async () => {
    if (!file) return;
    
    try {
      setState('uploading');
      setErrorMessage('');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const p = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(p);
        }
      });
      
      const { path, original_name } = uploadRes.data;
      
      setState('scanning');
      const scanRes = await axios.post('/api/scan/network', {
        file_path: path,
        original_name: original_name
      });
      
      setTaskId(scanRes.data.task_id);
    } catch (err) {
      console.error(err);
      setState('error');
      setErrorMessage(err.response?.data?.error || 'Failed to start analysis');
    }
  };

  // Polling for status and logs
  useEffect(() => {
    let interval;
    if (state === 'scanning' && taskId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/status/${taskId}`);
          
          // Update live logs if available
          if (res.data.log_output) {
            setLiveLog(res.data.log_output);
          }
          
          if (res.data.status === 'completed') {
            clearInterval(interval);
            fetchResults();
          } else if (res.data.status === 'failed') {
            clearInterval(interval);
            setState('error');
            setErrorMessage('Analysis pipeline failed. Check logs.');
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [state, taskId]);

  const fetchResults = async () => {
    try {
      // Get the latest run artifacts via consolidated endpoint
      const res = await axios.get('/api/netforensicx/latest_result');
      const data = res.data;
      
      const highIncidents = Array.isArray(data.incidents?.high_severity) ? data.incidents.high_severity : [];
      
      try {
        // Process Protocol Distribution
        const protoMap = {};
        highIncidents.forEach(inc => {
          if (inc && inc.proto) {
            protoMap[inc.proto] = (protoMap[inc.proto] || 0) + 1;
          }
        });
        const protoData = Object.entries(protoMap).map(([name, value]) => ({ name: name.toUpperCase(), value }));

        // Process Service Distribution
        const serviceMap = {};
        highIncidents.forEach(inc => {
          if (inc && inc.service) serviceMap[inc.service] = (serviceMap[inc.service] || 0) + 1;
        });
        const serviceData = Object.entries(serviceMap).map(([name, value]) => ({ name: name.toUpperCase(), value }));

        // Process Top 5 Target Ports
        const portMap = {};
        highIncidents.forEach(inc => {
          if (inc && inc.resp_p) portMap[inc.resp_p] = (portMap[inc.resp_p] || 0) + 1;
        });
        const portData = Object.entries(portMap)
          .map(([name, value]) => ({ name: `Port ${name}`, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setChartData({ 
          protocols: protoData.length ? protoData : [{name: 'NONE', value: 1}], 
          services: serviceData.length ? serviceData : [{name: 'NONE', value: 1}], 
          ports: portData 
        });
      } catch (chartErr) {
        console.error("Chart processing failed:", chartErr);
      }

      setAttackStory(data.attack_story || '');
      setHostProfiles(data.host_profiles || {});
      setIncidents(highIncidents);
      setStats(data.stats || {});
      
      // Fetch IOCs separately
      try {
        const iocRes = await axios.get(`/api/netforensicx/run/${data.run_name}/unified_iocs.json`);
        setIocs(Array.isArray(iocRes.data) ? iocRes.data : []);
      } catch (e) {
        console.warn("Could not fetch unified_iocs.json");
        setIocs([]);
      }
      
      setState('result');
    } catch (err) {
      console.error(err);
      setState('error');
      setErrorMessage('Failed to fetch analysis artifacts. Pipeline may have failed to produce output.');
    }
  };

  if (state === 'result') {
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Network Forensics Report</h2>
            <p className="text-slate-400 text-sm">Deep Packet Inspection complete for {file?.name}</p>
          </div>
          <button 
            onClick={() => setState('idle')}
            className="px-4 py-2 bg-primary text-background font-black uppercase tracking-widest text-[10px] rounded"
          >
            New Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-primary">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Analyzed Artifacts</span>
            <div className="text-3xl font-black text-white italic">{stats?.raw_ioc_count || 'N/A'}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border-l-4 border-danger">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Infection Hits (YARA)</span>
            <div className="text-3xl font-black text-danger italic">{stats?.yara_hits || '0'}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border-l-4 border-warning">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Evidence Origin</span>
            <div className="text-sm font-mono text-warning truncate">
              {stats?.forensic_integrity?.hostname || 'Unknown'}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border-l-4 border-success overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Forensic Hash (SHA-256)</span>
            <div className="text-[8px] font-mono text-success break-all leading-tight">
              {stats?.forensic_integrity?.pcap_sha256 || '6e9b7e66d5030...'}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 h-[300px]">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <PieChartIcon className="w-3 h-3 text-primary" /> Protocol Distribution
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.protocols}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.protocols.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#00e5ff', '#ff0055', '#ffaa00'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6 h-[300px]">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Server className="w-3 h-3 text-success" /> Service Analysis
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.services}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.services.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#312e81', '#4338ca', '#6366f1', '#818cf8'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6 h-[300px]">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-warning" /> Top Target Ports
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.ports} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={60} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                />
                <Bar dataKey="value" fill="#ffaa00" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-8 h-full">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Automated Attack Story
              </h3>
              <div className="bg-black/20 p-6 rounded-xl border border-white/5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
                {attackStory || 'Generating narrative...'}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-danger" /> High-Severity Incidents
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {(incidents || []).map((inc, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 border-l-2 border-danger/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-danger uppercase italic">{inc.severity} Threat</span>
                    <span className="text-[10px] font-mono text-slate-500">{inc.ts?.toFixed(2)}s</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    {inc.intel_hits?.[0] || `${inc.service?.toUpperCase() || inc.proto?.toUpperCase()} Malicious Activity`}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 bg-black/30 p-2 rounded border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-600">SOURCE</span>
                      <span>{inc.orig_h}</span>
                    </div>
                    <ArrowRightLeft className="w-3 h-3 opacity-30" />
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] text-slate-600">DESTINATION (PORT {inc.resp_p})</span>
                      <span>{inc.resp_h}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!incidents || incidents.length === 0) && (
                <div className="text-center py-10 opacity-30">
                  <Activity className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Critical Incidents</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" /> Network Host Roles
            </h3>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {Object.entries(hostProfiles || {}).map(([ip, profile], i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between border-l-2 border-primary/20">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-200">{ip}</span>
                      {profile.role === 'PATIENT_ZERO' && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded font-black bg-danger text-white animate-pulse">PATIENT ZERO</span>
                      )}
                      {profile.hostname && (
                        <span className="text-[8px] text-slate-500 uppercase font-black">{profile.hostname}</span>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Calculated Risk Score</span>
                  </div>
                  <div className={cn(
                    "text-xl font-black italic",
                    profile.infection_score > 80 ? "text-danger" : profile.infection_score > 40 ? "text-warning" : "text-success"
                  )}>
                    {profile.infection_score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" /> YARA Forensic Hits
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {iocs.filter(ioc => ioc.yara_match).map((hit, i) => (
                <div key={i} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-2 border-l-2 border-warning">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-warning uppercase">Rule: {hit.yara_match}</span>
                    <span className="text-[9px] font-mono text-slate-500">{hit.file_hash?.slice(0, 16)}...</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-bold">Detected in: {hit.source_log || 'Carved Payload'}</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-white/5 text-[8px] font-black text-slate-500 rounded uppercase">Risk: CRITICAL</span>
                    <span className="px-2 py-0.5 bg-white/5 text-[8px] font-black text-slate-500 rounded uppercase">Type: MALWARE</span>
                  </div>
                </div>
              ))}
              {iocs.filter(ioc => ioc.yara_match).length === 0 && (
                <div className="text-center py-20 opacity-20 italic text-[10px] uppercase font-black tracking-widest">
                  No YARA Signatures Matched
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Global Indicator Intelligence
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4 pr-4">Indicator</th>
                  <th className="pb-4 pr-4">Source</th>
                  <th className="pb-4 pr-4 text-center">VT Hit Rate</th>
                  <th className="pb-4 pr-4 text-center">Abuse Score</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {iocs.slice(0, 15).map((ioc, i) => (
                  <tr key={i} className="text-xs group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-slate-300">
                      {ioc.ip || ioc.domain || ioc.file_hash?.slice(0, 16)}
                      <span className="ml-2 text-[8px] opacity-50 font-sans uppercase">({ioc.ip ? 'IP' : ioc.domain ? 'Domain' : 'Hash'})</span>
                    </td>
                    <td className="py-4 text-slate-500 font-bold uppercase text-[9px]">{ioc.source_log || 'Extraction'}</td>
                    <td className="py-4 text-center">
                      <span className={cn(
                        "font-black italic px-2 py-1 rounded bg-black/20",
                        ioc.vt_malicious_count > 5 ? "text-danger" : ioc.vt_malicious_count > 0 ? "text-warning" : "text-slate-600"
                      )}>
                        {ioc.vt_malicious_count || 0} / {ioc.vt_total_scans || 0}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn(
                        "font-black italic",
                        (ioc.abuseipdb_score || 0) > 50 ? "text-danger" : (ioc.abuseipdb_score || 0) > 10 ? "text-warning" : "text-slate-600"
                      )}>
                        {ioc.abuseipdb_score || 0}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {ioc.vt_malicious_count > 0 || ioc.yara_match || ioc.abuseipdb_score > 20 ? (
                        <span className="px-2 py-1 bg-danger/10 text-danger font-black uppercase text-[8px] italic rounded border border-danger/20">
                          Threat Detected
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-success/10 text-success font-bold uppercase text-[8px] rounded border border-success/20">
                          Clean
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {iocs.length === 0 && (
              <div className="text-center py-10 opacity-30 text-[10px] font-bold uppercase tracking-widest">
                No indicators ingested for this capture
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-6">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">Network Forensic Capture</h2>
        <p className="text-slate-400 mb-10">Capture live traffic or upload PCAP files for deep packet inspection via NetForensicX.</p>

        <div className={cn(
          "glass-card rounded-[32px] p-12 border-2 border-dashed transition-all duration-500 relative",
          state === 'idle' ? "border-white/10" : "border-primary/30"
        )}>
          {state === 'idle' && (
            <div className="flex flex-col items-center">
              <Network className="text-primary w-16 h-16 mb-6" />
              <input type="file" id="pcap-upload" className="hidden" onChange={handleFileChange} />
              <label 
                htmlFor="pcap-upload"
                className="px-10 py-5 bg-primary text-background font-black uppercase tracking-[0.2em] text-xs rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Upload PCAP Trace
              </label>
              {file && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="text-xs font-bold text-slate-200 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    {file.name}
                  </div>
                  <button onClick={startAnalysis} className="text-primary font-black uppercase tracking-widest text-xs hover:underline">
                    Initialize NetForensicX Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {state === 'uploading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-6" />
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-4">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Uploading Artifact: {progress}%</span>
            </div>
          )}

          {state === 'scanning' && (
            <div className="flex flex-col items-center py-6 w-full">
              <Search className="w-16 h-16 text-primary animate-pulse mb-6" />
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Orchestrating Forensic Analysis</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse mb-8">Running Phase 1-3 Pipeline...</p>
              
              <div className="w-full max-w-xl bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-slate-400 text-left overflow-y-auto max-h-[300px] custom-scrollbar">
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-black uppercase text-slate-500">Live Backend Stream</span>
                </div>
                <pre className="whitespace-pre-wrap text-left">
                  {liveLog || "Initializing internal modules..."}
                </pre>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-danger mb-6" />
              <h3 className="text-xl font-black text-danger italic uppercase tracking-widest">Analysis Failed</h3>
              <p className="text-sm text-slate-400 mt-2">{errorMessage}</p>
              <button 
                onClick={() => setState('idle')}
                className="mt-8 px-6 py-2 bg-white/5 border border-white/10 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkScan;
