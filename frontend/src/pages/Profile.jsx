import { User, Shield, Key, Mail, MapPin, Calendar, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  
  // Safely parse user data to prevent "Black Screen" crashes
  let user = { username: 'Agent', email: 'agent@vigilcore.io' };
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      user = JSON.parse(userJson);
    }
  } catch (err) {
    console.error("Failed to parse user data", err);
  }

  const handleLogout = async () => {
    try {
      // Backend api_logout is a GET route
      await axios.get('/api/logout');
    } catch (e) {
      console.warn("Logout failed on server, clearing local session anyway.");
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-48 h-48 rounded-3xl border-4 border-primary/20 p-2 mb-6">
            <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center relative overflow-hidden group">
              <User size={80} className="text-primary opacity-50" />
              <img 
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`} 
                alt="Profile" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">{user.username}</h2>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">VigilCore Agent</span>
          
          <button 
            onClick={handleLogout}
            className="w-full mt-8 py-4 bg-danger/10 border border-danger/20 hover:bg-danger/20 text-danger text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Terminate Session
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
              Security Clearance & Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <p className="text-sm font-medium text-slate-200">{user.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3 h-3" /> System Role
                </span>
                <p className="text-sm font-medium text-slate-200">Super Administrator</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-3 h-3" /> Access Token ID
                </span>
                <p className="text-sm font-mono text-primary">VC-9912-PX-2026</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Primary Node
                </span>
                <p className="text-sm font-medium text-slate-200">DC-NORTH-04 (LIVE)</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Activity Timeline</h3>
            <div className="space-y-6">
              {[
                { event: 'Authorized Case #8912 Access', time: '2 hours ago', icon: Shield, color: 'text-primary' },
                { event: 'Completed Malware Analysis: payload_7.exe', time: '5 hours ago', icon: Clock, color: 'text-success' },
                { event: 'System Login from 10.158.87.59', time: 'Yesterday', icon: User, color: 'text-slate-400' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200">{item.event}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
