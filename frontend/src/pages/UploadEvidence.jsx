import React, { useState } from 'react';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FolderPlus,
  ShieldCheck,
  User,
  Type
} from 'lucide-react';

const UploadEvidence = () => {
  const [files, setFiles] = useState([]);
  const [caseInfo, setCaseInfo] = useState({
    name: '',
    investigator: '',
    description: ''
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold text-white tracking-tight">Upload Evidence</h2>
        <p className="text-slate-400 text-sm">Add new artifacts, RAM dumps, or network captures to the active case.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="glass-card rounded-3xl p-12 border-2 border-dashed border-white/10 hover:border-primary/50 flex flex-col items-center justify-center text-center group cursor-pointer transition-all"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <Upload className="w-10 h-10 text-slate-500 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drag & Drop Evidence</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              Drop RAM dumps (.raw, .mem), PCAP files, or logs. Max file size: 20GB.
            </p>
            <label className="px-6 py-3 bg-primary text-background font-bold rounded-xl cursor-pointer hover:bg-accent transition-all shadow-lg shadow-primary/20">
              Browse Files
              <input type="file" multiple className="hidden" onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} />
            </label>
          </div>

          {files.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <File className="w-4 h-4" />
                Queued for Upload ({files.length})
              </h4>
              <div className="space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <File className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{file.name}</span>
                        <span className="text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="p-1.5 rounded-lg hover:bg-danger/20 text-slate-500 hover:text-danger transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-primary" />
              Case Context
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Type className="w-3 h-3" /> Case Name
                </label>
                <input 
                  type="text" 
                  value={caseInfo.name}
                  onChange={(e) => setCaseInfo({...caseInfo, name: e.target.value})}
                  placeholder="e.g. Incident-2026-05"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Investigator
                </label>
                <input 
                  type="text" 
                  value={caseInfo.investigator}
                  onChange={(e) => setCaseInfo({...caseInfo, investigator: e.target.value})}
                  placeholder="Lead Forensic Agent"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <File className="w-3 h-3" /> Description
                </label>
                <textarea 
                  value={caseInfo.description}
                  onChange={(e) => setCaseInfo({...caseInfo, description: e.target.value})}
                  placeholder="Brief summary of the artifact..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-accent transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Initialize Ingestion
              </button>
              <button 
                onClick={() => setFiles([])}
                className="w-full py-3 bg-transparent text-slate-400 hover:text-slate-200 font-medium rounded-xl transition-all"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 bg-warning/5 border-warning/10">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-warning shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-warning">Integrity Check</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  All files are automatically hashed (SHA-256) upon ingestion to maintain chain of custody.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadEvidence;
