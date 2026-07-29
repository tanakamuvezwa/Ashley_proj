import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Briefcase, TrendingUp, Clock,
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Plus,
  DollarSign, Calendar, MapPin, Building, RefreshCw
} from 'lucide-react';
import { UserAccount, LoanRequest, ProjectPitch } from '../types';

interface UserDashboardProps {
  currentUser: UserAccount;
  onNavigate: (tab: 'uber-loans' | 'projects') => void;
}

const STATUS_STEPS = ['Submitted', 'Under Review', 'Bidding Active', 'Funded'];

const LoanStatusTracker: React.FC<{ loan: LoanRequest }> = ({ loan }) => {
  const getStep = () => {
    if (loan.status === 'Funded') return 3;
    if (loan.status === 'Bidding Active') return 2;
    return 1;
  };
  const step = getStep();

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        {STATUS_STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                i <= step ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-600'
              }`}>
                {i < step ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : i === step ? (
                  <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                )}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-wider hidden sm:block ${
                i <= step ? 'text-emerald-400' : 'text-slate-600'
              }`}>{s}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-all ${i < step ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, onNavigate }) => {
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [pitches, setPitches] = useState<ProjectPitch[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingPitches, setLoadingPitches] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'loans' | 'pitches'>('overview');

  const fetchLoans = async () => {
    setLoadingLoans(true);
    try {
      const token = localStorage.getItem('apex_user') 
        ? JSON.parse(localStorage.getItem('apex_user')!).token 
        : null;
      const res = await fetch('/api/my/loans', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load loans:', err);
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchPitches = async () => {
    setLoadingPitches(true);
    try {
      const token = localStorage.getItem('apex_user')
        ? JSON.parse(localStorage.getItem('apex_user')!).token
        : null;
      const res = await fetch('/api/my/pitches', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPitches(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load pitches:', err);
    } finally {
      setLoadingPitches(false);
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchPitches();
  }, []);

  const totalRequested = loans.reduce((acc, l) => acc + l.amountRequested, 0);
  const fundedCount = loans.filter(l => l.status === 'Funded').length;
  const activeCount = loans.filter(l => l.status === 'Bidding Active').length;

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Personal Workspace</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome back, {currentUser.name.split(' ')[0]}</h2>
          <p className="text-slate-400 text-xs mt-1">Track your credit applications, ventures, and investment activity.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border ${
            currentUser.role === 'borrower'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : currentUser.role === 'lender'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
          }`}>
            {currentUser.role}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{currentUser.email}</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-1 mb-8 bg-slate-900/40 p-1 rounded-xl border border-white/5 w-fit">
        {(['overview', 'loans', 'pitches'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
              activeSection === s
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Loan Applications', value: loans.length, icon: FileText, color: 'emerald' },
              { label: 'Funded Loans', value: fundedCount, icon: CheckCircle2, color: 'teal' },
              { label: 'Active Bids', value: activeCount, icon: TrendingUp, color: 'amber' },
              { label: 'Total Requested', value: `$${(totalRequested / 1000).toFixed(0)}K`, icon: DollarSign, color: 'slate' }
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card p-5 rounded-2xl border border-white/5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                  color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                  color === 'teal' ? 'bg-teal-500/15 text-teal-400' :
                  color === 'amber' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-slate-700/50 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent Loans Preview */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Recent Loan Applications</span>
              </h3>
              <button
                onClick={() => setActiveSection('loans')}
                className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1 hover:text-emerald-300 transition cursor-pointer"
              >
                <span>View all</span><ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {loadingLoans ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /><span className="text-xs">Loading...</span>
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <FileText className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-slate-500 text-xs">No loan applications yet.</p>
                <button
                  onClick={() => onNavigate('uber-loans')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 text-xs font-black cursor-pointer hover:bg-emerald-500 transition"
                >
                  <Plus className="w-3.5 h-3.5" /><span>Apply for Capital</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.slice(0, 3).map(loan => (
                  <div key={loan.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{loan.businessName}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{loan.id}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                        loan.status === 'Funded'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : loan.status === 'Bidding Active'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-700/50 text-slate-400 border-slate-700/50'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <LoanStatusTracker loan={loan} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('uber-loans')}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-emerald-500/20 text-left cursor-pointer group transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition">
                  <DollarSign className="w-4.5 h-4.5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
              </div>
              <p className="text-sm font-bold text-white">Apply for Capital</p>
              <p className="text-[10px] text-slate-500 mt-1">Submit a new loan application to the AI matching desk</p>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-amber-500/20 text-left cursor-pointer group transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
              </div>
              <p className="text-sm font-bold text-white">Browse Ventures</p>
              <p className="text-[10px] text-slate-500 mt-1">Invest in vetted SADC projects and earn up to 21% ROI</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── MY LOANS ─────────────────────────────────────────── */}
      {activeSection === 'loans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">My Loan Applications ({loans.length})</h3>
            <div className="flex items-center space-x-2">
              <button onClick={fetchLoans} className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('uber-loans')}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center space-x-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" /><span>New Application</span>
              </button>
            </div>
          </div>

          {loadingLoans ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /><span className="text-xs">Fetching your applications...</span>
            </div>
          ) : loans.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl border border-white/5 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-white font-bold">No applications yet</p>
              <p className="text-slate-500 text-xs">Submit your first capital request to get matched with lenders across SADC.</p>
              <button onClick={() => onNavigate('uber-loans')} className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-slate-950 text-xs font-black cursor-pointer hover:bg-emerald-500 transition">
                <Plus className="w-3.5 h-3.5" /><span>Apply for Capital</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map(loan => (
                <div key={loan.id} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-white">{loan.businessName}</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                          loan.status === 'Funded' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          loan.status === 'Bidding Active' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-slate-700/50 text-slate-400 border-white/5'
                        }`}>{loan.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{loan.id} · {loan.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-white">${loan.amountRequested.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{loan.tenureMonths} months · {loan.currency}</p>
                    </div>
                  </div>

                  <LoanStatusTracker loan={loan} />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">Risk Rating</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">{loan.riskScore}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">Credit Score</p>
                      <p className="text-xs font-bold text-white mt-0.5">{loan.creditScore}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">Bank Bids</p>
                      <p className="text-xs font-bold text-white mt-0.5">{loan.offers?.length || 0} offers</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">Location</p>
                      <p className="text-xs font-bold text-white mt-0.5 truncate">{loan.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MY PITCHES ───────────────────────────────────────── */}
      {activeSection === 'pitches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">My Venture Pitches ({pitches.length})</h3>
            <div className="flex items-center space-x-2">
              <button onClick={fetchPitches} className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-[10px] font-black flex items-center space-x-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" /><span>Submit Pitch</span>
              </button>
            </div>
          </div>

          {loadingPitches ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /><span className="text-xs">Fetching your pitches...</span>
            </div>
          ) : pitches.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl border border-white/5 text-center space-y-4">
              <Briefcase className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-white font-bold">No pitches submitted</p>
              <p className="text-slate-500 text-xs">Pitch your business venture to attract investors from across SADC.</p>
              <button onClick={() => onNavigate('projects')} className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-600 text-slate-950 text-xs font-black cursor-pointer hover:bg-amber-500 transition">
                <Plus className="w-3.5 h-3.5" /><span>Submit Pitch</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pitches.map(pitch => (
                <div key={pitch.id} className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-white leading-snug">{pitch.title}</p>
                      <span className="ml-2 shrink-0 px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{pitch.riskRating}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">{pitch.id} · {pitch.category}</p>
                  </div>
                  {/* Funding progress */}
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                      <span>Raised: ${pitch.raisedCapital.toLocaleString()}</span>
                      <span>Target: ${pitch.targetCapital.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (pitch.raisedCapital / pitch.targetCapital) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-mono border-t border-white/5 pt-3">
                    <div><span className="text-slate-500 block">ROI</span><span className="text-emerald-400 font-bold">{pitch.projectedROI}% p.a.</span></div>
                    <div><span className="text-slate-500 block">Backers</span><span className="text-white font-bold">{pitch.backersCount}</span></div>
                    <div><span className="text-slate-500 block">Location</span><span className="text-white font-bold truncate block">{pitch.location}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
};
