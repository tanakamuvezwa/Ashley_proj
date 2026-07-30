import React from 'react';
import { 
 Zap, 
 ShieldCheck, 
 MapPin, 
 Mail, 
 Phone, 
 Globe2,
 Lock,
 Building2
} from 'lucide-react';

export const Footer: React.FC = () => {
 return (
 <footer className="border-t theme-border pt-16 pb-12 theme-muted text-xs" style={{ background: 'var(--bg-surface)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Top Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b theme-border">
 
 {/* Brand Info */}
 <div className="lg:col-span-2 space-y-4">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold">
 <Zap className="w-5 h-5 fill-slate-950" />
 </div>
 <span className="text-xl font-black theme-text">
 ApexLend<span className="gold-gradient-text">AI</span>
 </span>
 </div>

 <p className="theme-muted leading-relaxed max-w-sm">
 ApexLend Holdings Limited ("ApexLend") is an Artificial Intelligence-powered financial marketplace that transforms how individuals, businesses, institutional investors, and financial institutions discover, negotiate, and transact financial products.
 </p>

 <div className="flex items-center space-x-2 text-emerald-400 font-medium">
 <ShieldCheck className="w-4 h-4" />
 <span>Technology & Distribution Layer for SADC Financial Markets</span>
 </div>
 </div>

 {/* Quick Links: Products */}
 <div className="space-y-3">
 <h4 className="theme-text font-bold text-sm uppercase tracking-wider">Financial Marketplace</h4>
 <ul className="space-y-2">
 <li><a href="#uber-loans" className="hover:text-emerald-400 transition">Uber for Loans Engine</a></li>
 <li><a href="#projects" className="hover:text-emerald-400 transition">Idea & Project Pitch Room</a></li>
 <li><a href="#institutional" className="hover:text-emerald-400 transition">Bank & Fund Bidding Portal</a></li>
 <li><a href="#fx" className="hover:text-emerald-400 transition">Cross-Border FX Exchange</a></li>
 <li><a href="#insurance" className="hover:text-emerald-400 transition">Embedded Asset Insurance</a></li>
 </ul>
 </div>

 {/* SADC Regional Footprint */}
 <div className="space-y-3">
 <h4 className="theme-text font-bold text-sm uppercase tracking-wider">SADC Markets</h4>
 <ul className="space-y-2">
 <li className="flex items-center space-x-1.5 text-slate-300 font-semibold">
 <img src="https://flagcdn.com/w40/zw.png" alt="ZW" className="w-4 h-3 object-cover rounded-sm" /> <span>Zimbabwe (Anchor HQ)</span>
 </li>
 <li className="flex items-center space-x-1.5">
 <img src="https://flagcdn.com/w40/za.png" alt="ZA" className="w-4 h-3 object-cover rounded-sm" /> <span>South Africa (Capital Hub)</span>
 </li>
 <li className="flex items-center space-x-1.5">
 <img src="https://flagcdn.com/w40/bw.png" alt="BW" className="w-4 h-3 object-cover rounded-sm" /> <span>Botswana Corridor</span>
 </li>
 <li className="flex items-center space-x-1.5">
 <img src="https://flagcdn.com/w40/zm.png" alt="ZM" className="w-4 h-3 object-cover rounded-sm" /> <span>Zambia Agri & Trade</span>
 </li>
 <li className="flex items-center space-x-1.5">
 <img src="https://flagcdn.com/w40/mz.png" alt="MZ" className="w-4 h-3 object-cover rounded-sm" /> <span>Mozambique Logistics</span>
 </li>
 </ul>
 </div>

 {/* Corporate Offices */}
 <div className="space-y-3">
 <h4 className="theme-text font-bold text-sm uppercase tracking-wider">Contact & Offices</h4>
 <div className="space-y-2 theme-muted">
 <div className="flex items-start space-x-2">
 <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
 <span>Harare Innovation District, Borrowdale, Harare, Zimbabwe</span>
 </div>
 <div className="flex items-center space-x-2">
 <Mail className="w-4 h-4 text-amber-400 shrink-0" />
 <span>capital@apexlend.ai</span>
 </div>
 <div className="flex items-center space-x-2">
 <Globe2 className="w-4 h-4 text-teal-400 shrink-0" />
 <span>www.apexlend.ai</span>
 </div>
 </div>
 </div>

 </div>

 {/* Bottom Legal & Regulatory Row */}
 <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 theme-muted text-[11px]">
 <p>© 2026 ApexLend Holdings Limited. All rights reserved.</p>
 <div className="flex items-center space-x-4">
 <span className="flex items-center space-x-1">
 <Lock className="w-3 h-3 text-emerald-400" />
 <span>256-bit Bank Grade Encryption</span>
 </span>
 <span>•</span>
 <a href="#" className="hover:theme-text">Privacy Policy</a>
 <span>•</span>
 <a href="#" className="hover:theme-text">Terms of Marketplace Service</a>
 </div>
 </div>

 </div>
 </footer>
 );
};
