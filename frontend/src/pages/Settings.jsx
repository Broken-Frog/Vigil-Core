import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Database, Bell, Lock, Cpu } from 'lucide-react';

const SettingRow = ({ icon: Icon, title, desc, children }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary border border-white/5">
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white uppercase tracking-tight">{title}</span>
        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">{desc}</span>
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ active }) => (
  <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${active ? 'bg-primary' : 'bg-slate-700'}`}>
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
  </div>
);

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">System Settings</h2>
        <p className="text-slate-400 text-sm">Configure forensic engine behavior and security parameters.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Core Engine</h3>
        <SettingRow 
          icon={Shield} 
          title="Heuristic Deep Scan" 
          desc="Enable behavioral analysis for unknown binaries"
        >
          <Toggle active={true} />
        </SettingRow>
        <SettingRow 
          icon={Cpu} 
          title="Multi-threaded Analysis" 
          desc="Distribute scanning load across multiple CPU cores"
        >
          <Toggle active={true} />
        </SettingRow>
        <SettingRow 
          icon={Database} 
          title="Cloud Threat Feed" 
          desc="Sync signature database with global threat intel"
        >
          <Toggle active={false} />
        </SettingRow>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Network Configuration</h3>
        <SettingRow 
          icon={Server} 
          title="Promiscuous Mode" 
          desc="Allow network interface to capture all traffic"
        >
          <Toggle active={true} />
        </SettingRow>
        <SettingRow 
          icon={Lock} 
          title="Packet Decryption" 
          desc="Attempt SSL/TLS decryption via master secrets"
        >
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all">
            Manage Keys
          </button>
        </SettingRow>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Notifications</h3>
        <SettingRow 
          icon={Bell} 
          title="Security Alerts" 
          desc="Notify Lead Investigator of critical threats"
        >
          <Toggle active={true} />
        </SettingRow>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
        <button className="px-8 py-3 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
          Discard Changes
        </button>
        <button className="px-10 py-3 bg-primary text-background font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
