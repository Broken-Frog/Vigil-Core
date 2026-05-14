import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Zap, Globe, Loader2, AlertCircle, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      await axios.post('/api/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <Globe size={1000} />
        </div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <Shield className="text-background w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">VIGILCORE</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-1 h-1 rounded-full bg-success"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">New Agent Enrollment</span>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[40px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <h2 className="text-xl font-black italic text-white uppercase tracking-tight mb-8">Enrollment</h2>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-xs font-bold">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Agent Alias
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="agent.alias"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Identity Identifier (Email)
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@vigilcore.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Cryptographic Key
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-700"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 bg-primary text-background font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enroll Agent'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-[10px] font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-colors">
              Already have an account? Access Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
