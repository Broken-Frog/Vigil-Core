import React from 'react';
import { cn } from '../utils/cn';
import { 
  Shield, 
  FileCode, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Clock, 
  Database, 
  Cpu,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { time: '10:00', cpu: 20, memory: 30, alerts: 2 },
  { time: '10:10', cpu: 35, memory: 32, alerts: 0 },
  { time: '10:20', cpu: 45, memory: 40, alerts: 5 },
  { time: '10:30', cpu: 30, memory: 45, alerts: 1 },
  { time: '10:40', cpu: 60, memory: 50, alerts: 12 },
  { time: '10:50', cpu: 40, memory: 55, alerts: 3 },
  { time: '11:00', cpu: 25, memory: 52, alerts: 1 },
];

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-background shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-xs font-bold ${trend > 0 ? 'text-success' : 'text-danger'} flex items-center gap-1`}>
          <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</span>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-5">
      <Icon size={120} />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-white tracking-tight">System Dashboard</h2>
          <p className="text-slate-400 text-sm">Real-time overview of forensic activity and system resources.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all">
            Export Summary
          </button>
          <button className="px-4 py-2 bg-primary text-background hover:bg-accent rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Cases" 
          value="12" 
          icon={Shield} 
          color="from-primary to-accent" 
          trend={12}
        />
        <StatCard 
          label="Evidence Files" 
          value="256" 
          icon={Database} 
          color="from-success to-emerald-400" 
          trend={5}
        />
        <StatCard 
          label="Active Alerts" 
          value="18" 
          icon={AlertTriangle} 
          color="from-danger to-orange-400" 
          trend={-8}
        />
        <StatCard 
          label="Malware Detected" 
          value="4" 
          icon={Zap} 
          color="from-warning to-yellow-400" 
          trend={100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Resource Monitoring
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-primary"></div> CPU
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-success"></div> RAM
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} />
                <YAxis stroke="#ffffff30" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11141b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#00d2ff" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="memory" stroke="#00ff9d" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            System Activity Log
          </h3>
          <div className="space-y-4">
            {[
              { time: '10:45:12', event: 'RAM Analysis Complete', status: 'success' },
              { time: '10:42:05', event: 'Suspicious IP Detected: 192.168.1.5', status: 'danger' },
              { time: '10:35:40', event: 'Network Dump Uploaded', status: 'primary' },
              { time: '10:30:11', event: 'New Case Initialized', status: 'primary' },
              { time: '10:25:55', event: 'Database Backup Completed', status: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    log.status === 'success' ? "bg-success" :
                    log.status === 'danger' ? "bg-danger" :
                    "bg-primary"
                  )}></div>
                  <div className="w-px flex-1 bg-white/5 mt-1"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
                  <span className="text-sm text-slate-300 font-medium">{log.event}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 transition-all uppercase tracking-widest">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
