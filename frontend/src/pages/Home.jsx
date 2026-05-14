import { Link } from 'react-router-dom';
import { Circle, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] p-12 overflow-hidden">
      {/* Background Globe Watermark */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Globe size={800} />
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-10">
          <Circle className="w-2 h-2 fill-success text-success" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            VigilCore Command Hub Operational
          </span>
        </div>

        <h1 className="text-7xl font-black italic text-white leading-[0.9] mb-8 uppercase tracking-tighter">
          Next-Gen <br />
          <span className="text-primary">Digital <br /> Forensics</span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-12 font-medium">
          Orchestrating high-fidelity malware analysis, deep packet inspection, and real-time 
          threat intelligence. Protecting enterprise assets through automated forensic 
          workflows and chain-of-custody excellence.
        </p>

        <div className="flex gap-6">
          <Link to="/malware" className="px-8 py-4 border-2 border-primary/30 hover:border-primary text-white font-black uppercase tracking-widest text-xs transition-all rounded-sm flex items-center gap-3 group">
            Initiate Analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/history" className="px-8 py-4 border-2 border-white/5 hover:border-white/20 text-slate-400 hover:text-white font-black uppercase tracking-widest text-xs transition-all rounded-sm">
            View Archives
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
