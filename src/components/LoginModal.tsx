import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, Sparkles, UserCheck, User } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  initialTab = 'login', 
  onClose, 
  onLoginSuccess 
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>(initialTab);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'borrower' | 'lender'>('borrower');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick Login Options
  const handleQuickLogin = (roleSelect: 'admin' | 'borrower' | 'lender') => {
    setActiveMode('login');
    if (roleSelect === 'admin') {
      setEmail('admin@apexlend.ai');
      setPassword('AdminPass123');
    } else if (roleSelect === 'borrower') {
      setEmail('ashley@apexlend.ai');
      setPassword('AshleyPass123');
    } else {
      setEmail('lender@apexlend.ai');
      setPassword('LenderPass123');
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (activeMode === 'register' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = activeMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = activeMode === 'login' 
      ? { email, password } 
      : { name, email, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication action failed');
      }

      onLoginSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/10 relative shadow-2xl bg-slate-950">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 transition border border-white/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 border border-white/10 p-0.5 rounded-xl mb-6 text-xs font-bold font-mono">
          <button
            onClick={() => { setActiveMode('login'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg transition uppercase text-center ${
              activeMode === 'login' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveMode('register'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg transition uppercase text-center ${
              activeMode === 'register' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold text-white">
            {activeMode === 'login' ? 'Login to ApexLend AI' : 'Create New Account'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {activeMode === 'login' 
              ? 'Connect to SADC\'s leading capital bidding network' 
              : 'Sign up to raise capital or deploy debt assets programmatically'}
          </p>
        </div>

        {/* Developer Quick Logins (Only visible in Login mode) */}
        {activeMode === 'login' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-[10px]">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Developer Quick Login Presets</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-1 rounded-lg bg-slate-950 text-[9px] font-bold text-amber-400 border border-amber-500/20 hover:border-amber-400 hover:bg-slate-900 transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('borrower')}
                className="py-1.5 px-1 rounded-lg bg-slate-950 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 hover:border-emerald-400 hover:bg-slate-900 transition"
              >
                Borrower (SME)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('lender')}
                className="py-1.5 px-1 rounded-lg bg-slate-950 text-[9px] font-bold text-sky-400 border border-sky-500/20 hover:border-sky-400 hover:bg-slate-900 transition"
              >
                Lender (Bank)
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-450 text-[11px] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {activeMode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs text-white bg-slate-950/40"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs text-white bg-slate-950/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs text-white bg-slate-950/40"
                required
              />
            </div>
          </div>

          {activeMode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">I want to register as a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white bg-[#0F172A]"
              >
                <option value="borrower">Borrower (SADC SME seeking capital)</option>
                <option value="lender">Lender (Bank / Financial Fund Manager)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer border border-emerald-400/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserCheck className="w-4.5 h-4.5" />
                <span>{activeMode === 'login' ? 'Verify Credentials' : 'Sign Up Account'}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
