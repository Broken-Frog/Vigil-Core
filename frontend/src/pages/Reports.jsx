import React from 'react';
import { FileSearch, Download, Share2, Printer, Search, FileText } from 'lucide-react';

const ReportCard = ({ id, name, date, type, status }) => (
  <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-xl bg-white/5 text-primary">
        <FileText size={24} />
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"><Download size={16}/></button>
        <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"><Share2 size={16}/></button>
      </div>
    </div>
    <div className="space-y-1 mb-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate">{name}</h3>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <span>{id}</span>
        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
        <span>{date}</span>
      </div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-white/5">
      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">{type}</span>
      <span className="text-[10px] font-black text-success uppercase tracking-widest italic">{status}</span>
    </div>
  </div>
);

const Reports = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Forensic Reports</h2>
          <p className="text-slate-400 text-sm">Comprehensive documentation of analyzed artifacts and case evidence.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <FileSearch size={14} />
            Generate New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ReportCard id="REP-001" name="Case #8912 Malware Report" date="2026-05-11" type="Malware" status="Verified" />
        <ReportCard id="REP-002" name="Network Exfiltration Analysis" date="2026-05-11" type="Network" status="Final" />
        <ReportCard id="REP-003" name="System Node 04 Health Audit" date="2026-05-10" type="System" status="Archived" />
        <ReportCard id="REP-004" name="Memory Forensics Log" date="2026-05-10" type="RAM" status="Verified" />
        <ReportCard id="REP-005" name="PCAP Capture: Gateway A" date="2026-05-09" type="Network" status="Draft" />
        <ReportCard id="REP-006" name="Incident Response Summary" date="2026-05-09" type="Full Case" status="Encrypted" />
      </div>
    </div>
  );
};

export default Reports;
