import React, { useState } from 'react';
import { INITIAL_PROJECT_PITCHES } from '../data/mockData';
import { ProjectPitch } from '../types';
import { 
  Briefcase, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Users, 
  DollarSign, 
  Filter, 
  Sparkles, 
  CheckCircle,
  X,
  Award,
  ChevronRight
} from 'lucide-react';

export const ProjectMarketplace: React.FC = () => {
  const [pitches, setPitches] = useState<ProjectPitch[]>(INITIAL_PROJECT_PITCHES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Modal State for Investing
  const [investModalProject, setInvestModalProject] = useState<ProjectPitch | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(1000);
  const [isSuccessPledge, setIsSuccessPledge] = useState<boolean>(false);

  // Modal State for Submitting New Project
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ProjectPitch['category']>('Agriculture & AgriTech');
  const [newTarget, setNewTarget] = useState<number>(50000);
  const [newRoi, setNewRoi] = useState<number>(20);
  const [newSummary, setNewSummary] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('Harare, Zimbabwe');

  // Filter Logic
  const filteredPitches = pitches.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchCountry = selectedCountry === 'All' || p.country === selectedCountry;
    return matchCategory && matchCountry;
  });

  // Handle Invest Submission
  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investModalProject) return;

    setPitches((prev) =>
      prev.map((item) => {
        if (item.id === investModalProject.id) {
          return {
            ...item,
            raisedCapital: item.raisedCapital + pledgeAmount,
            backersCount: item.backersCount + 1
          };
        }
        return item;
      })
    );
    setIsSuccessPledge(true);
  };

  // Handle New Project Pitch Submission
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newPitch: ProjectPitch = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle || 'SADC Innovation Project',
      tagline: 'High potential business expansion initiative.',
      category: newCategory,
      targetCapital: newTarget,
      raisedCapital: 2500,
      currency: 'USD',
      projectedROI: newRoi,
      minInvestment: 250,
      durationMonths: 24,
      location: newLocation,
      country: 'Zimbabwe',
      entrepreneur: {
        name: 'Ashley Founder',
        role: 'Managing Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary: newSummary || 'Expanding regional footprint and production capacity.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      backersCount: 1,
      riskRating: 'AA',
      highlights: ['AI Verified Financial Plan', 'SADC Market Off-take', 'Local Regulatory Clearance']
    };

    setPitches([newPitch, ...pitches]);
    setShowSubmitModal(false);
    // Reset form
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Idea & Project Pitch Room</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Invest in vetted SADC Projects & Ideas
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Browse verified agricultural, solar, mining, and tech projects seeking seed capital or debt syndication from individuals and institutional investors.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="mt-4 md:mt-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-900/30 hover:scale-105 transition duration-200 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 fill-slate-950" />
          <span>Pitch Your Project Idea</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4 border-slate-800">
        
        {/* Category filter buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Category:
          </span>
          {['All', 'Agriculture & AgriTech', 'Renewable Energy', 'Fintech & Digital Trade', 'Real Estate & Logistics'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Country filter dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All SADC Countries</option>
            <option value="Zimbabwe">Zimbabwe</option>
            <option value="Botswana">Botswana</option>
            <option value="South Africa">South Africa</option>
            <option value="Zambia">Zambia</option>
          </select>
        </div>

      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredPitches.map((pitch) => {
          const progressPercent = Math.min(100, Math.round((pitch.raisedCapital / pitch.targetCapital) * 100));

          return (
            <div 
              key={pitch.id}
              className="glass-card rounded-3xl overflow-hidden border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              {/* Cover Image & Rating Badge */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={pitch.image} 
                  alt={pitch.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-black/30" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-emerald-400">
                    {pitch.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Risk Grade {pitch.riskRating}</span>
                  </span>
                </div>

                {/* Entrepreneur Overlay Banner */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center space-x-3 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800">
                  <img 
                    src={pitch.entrepreneur.avatar} 
                    alt={pitch.entrepreneur.name} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-bold text-white truncate">{pitch.entrepreneur.name}</p>
                      {pitch.entrepreneur.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{pitch.entrepreneur.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{pitch.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                    {pitch.title}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                    {pitch.pitchSummary}
                  </p>

                  {/* Highlights Pill Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {pitch.highlights.map((h, i) => (
                      <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Financial ROI & Progress Bar */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target</span>
                      <span className="text-xs font-extrabold text-white font-mono">${pitch.targetCapital.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Proj. ROI</span>
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">+{pitch.projectedROI}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Min Ticket</span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono">${pitch.minInvestment}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-300">
                        Raised: <strong className="text-emerald-400 font-mono">${pitch.raisedCapital.toLocaleString()}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">{progressPercent}% Funded</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setInvestModalProject(pitch);
                      setIsSuccessPledge(false);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Invest & Back Project</span>
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Invest / Pledge Modal */}
      {investModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border-emerald-500/40 relative shadow-2xl">
            <button 
              onClick={() => setInvestModalProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccessPledge ? (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
                    📈
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{investModalProject.title}</h3>
                    <p className="text-xs text-emerald-400 font-semibold">
                      Projected Annual Yield: +{investModalProject.projectedROI}% USD
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePledgeSubmit} className="space-y-4 my-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Enter Investment Amount (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                      <input 
                        type="number" 
                        min={investModalProject.minInvestment}
                        step={100}
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(Number(e.target.value))}
                        className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-lg font-mono font-bold"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Minimum investment ticket size: ${investModalProject.minInvestment} USD
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Annual Return:</span>
                      <span className="text-emerald-400 font-mono font-bold">+${Math.round(pledgeAmount * (investModalProject.projectedROI / 100))} USD/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Holding Period:</span>
                      <span className="text-white font-medium">{investModalProject.durationMonths} Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Certificate:</span>
                      <span className="text-amber-400 font-medium">Smart Debt/Equity Note</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/40 hover:scale-[1.02] transition cursor-pointer"
                  >
                    Confirm Investment Pledge
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Investment Confirmed!</h3>
                <p className="text-xs text-slate-300 mb-6">
                  You have backed <strong>{investModalProject.title}</strong> with <strong>${pledgeAmount.toLocaleString()} USD</strong>. Your digital debt/equity certificate is issued on the MBONGOCIRCLE ledger.
                </p>
                <button
                  onClick={() => setInvestModalProject(null)}
                  className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition border border-slate-700"
                >
                  Return to Pitch Room
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Project Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border-amber-500/40 relative shadow-2xl">
            <button 
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Pitch Your Business / Idea</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              List your venture on MBONGOCIRCLE's AI marketplace to get funded by institutional investors & regional banks.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Mutare Citrus Processing Plant"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="Agriculture & AgriTech">Agriculture & AgriTech</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Fintech & Digital Trade">Fintech & Digital Trade</option>
                    <option value="Mining & Minerals">Mining & Minerals</option>
                    <option value="Real Estate & Logistics">Real Estate & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Target Capital ($ USD)</label>
                  <input 
                    type="number" 
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Pitch Executive Summary</label>
                <textarea 
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Explain market opportunity, revenue model, and return timelines..."
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-900/40 hover:scale-[1.02] transition cursor-pointer"
              >
                Publish Pitch to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
