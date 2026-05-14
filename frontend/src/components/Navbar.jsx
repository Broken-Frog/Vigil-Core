import { User, Zap, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="h-20 border-b border-white/5 bg-[#0a0c10] flex items-center justify-between px-10 z-10">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <Circle className="w-2.5 h-2.5 fill-success text-success animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            System Node: <span className="text-primary">Live</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-warning" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Latency: <span className="text-warning">4.2ms</span>
          </span>
        </div>
      </div>

      <Link to="/profile" className="flex items-center gap-6 group cursor-pointer">
        <div className="text-right flex flex-col">
          <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-primary transition-colors">Anki</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Analyst</span>
        </div>
        <div className="w-12 h-12 rounded-xl border-2 border-primary/50 p-1 flex items-center justify-center group-hover:border-primary transition-all">
          <div className="w-full h-full rounded-lg bg-slate-800 flex items-center justify-center">
            <User className="text-primary w-6 h-6" />
          </div>
        </div>
      </Link>
    </header>
  );
};

export default Navbar;
