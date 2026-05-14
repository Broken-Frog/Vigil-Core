import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0c10] text-white p-10 text-center">
          <div className="w-20 h-20 bg-danger/10 rounded-2xl flex items-center justify-center mb-6 border border-danger/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Component Crash</h2>
          <p className="text-slate-400 max-w-md mb-8">
            The forensic interface encountered a critical runtime error. This might be due to malformed data from the backend.
          </p>
          <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-danger border border-danger/20 mb-8 max-w-2xl overflow-auto">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-background font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all"
          >
            Reboot Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
