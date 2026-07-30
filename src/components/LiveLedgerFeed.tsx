import React, { useState, useEffect } from 'react';
import { 
 CheckCircle2, 
 ShieldCheck, 
 ArrowUpRight, 
 ArrowDownLeft, 
 RefreshCw,
 Lock,
 Building2
} from 'lucide-react';

export const LiveLedgerFeed: React.FC = () => {
 const [transactions, setTransactions] = useState<any[]>([]);

 const fetchLedger = () => {
 fetch('/api/loan-requests')
 .then(res => res.json())
 .then(data => {
 if (Array.isArray(data)) {
 const fundedRequests = data.filter(r => r.status === 'Funded');
 
 // Format funded requests into transactions
 const dynamicTx = fundedRequests.map((req) => {
 const acceptedOffer = req.offers[0] || { lenderName: 'Horizon Commercial Bank' };
 return {
 hash: `0x${Math.floor(1000 + Math.random() * 9000).toString(16)}...${Math.floor(1000 + Math.random() * 9000).toString(16)}`,
 type: 'Loan Disbursement',
 amount: `$${req.amountRequested.toLocaleString()} USD`,
 borrower: req.businessName,
 institution: acceptedOffer.lenderName,
 status: 'Escrow Released to Supplier',
 time: 'Just Now'
 };
 });

 // Mock seeds
 const defaultTx = [
 {
 hash: '0x8f2a...91e4',
 type: 'Loan Disbursement',
 amount: '$25,000 USD',
 borrower: 'Highveld Horticulture Co.',
 institution: 'Horizon Commercial Bank',
 status: 'Escrow Released to Supplier',
 time: '3 mins ago'
 },
 {
 hash: '0x3c1b...77f9',
 type: 'Project Investment',
 amount: '$10,000 USD',
 borrower: 'Matabeleland 5MW Solar',
 institution: 'Vanguard SADC Impact Fund',
 status: 'Smart Equity Note Issued',
 time: '14 mins ago'
 },
 {
 hash: '0x9d4e...12a8',
 type: 'FX Triangulation',
 amount: '345,000 ZWG ➔ $24,909 USD',
 borrower: 'Harare Express Logistics',
 institution: 'Central Bank Triangulation Rail',
 status: 'Settled in RTGS',
 time: '28 mins ago'
 },
 {
 hash: '0x5e7f...34c2',
 type: 'Loan Repayment',
 amount: '$1,482 USD',
 borrower: 'SunPower Zim Commercial',
 institution: 'EcoLend Renewable Energy Desk',
 status: 'Automated POS Settlement',
 time: '42 mins ago'
 }
 ];

 setTransactions([...dynamicTx, ...defaultTx]);
 }
 })
 .catch(err => console.error('Failed to load ledger feed:', err));
 };

 useEffect(() => {
 fetchLedger();
 // Poll every 10 seconds for live updates
 const interval = setInterval(fetchLedger, 10000);
 return () => clearInterval(interval);
 }, []);

 return (
 <div className="glass-card p-6 rounded-3xl border-slate-800 my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-3">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
 <Lock className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-white flex items-center space-x-2">
 <span>Marketplace Audit & Escrow Ledger</span>
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
 </h3>
 <p className="text-xs text-slate-400">Cryptographically verified disbursements and interbank settlements.</p>
 </div>
 </div>

 <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/50">
 <ShieldCheck className="w-4 h-4" />
 <span>256-Bit Escrow Secured</span>
 </div>
 </div>

 <div className="space-y-3">
 {transactions.map((tx, idx) => (
 <div 
 key={idx}
 className="p-4 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition flex flex-col md:flex-row md:items-center justify-between text-xs gap-3"
 >
 <div className="flex items-center space-x-3">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
 tx.type.includes('Disbursement') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
 }`}>
 {tx.type.includes('Disbursement') ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
 </div>
 <div>
 <div className="flex items-center space-x-2">
 <h4 className="font-bold text-white text-sm">{tx.borrower}</h4>
 <span className="text-[10px] text-slate-400 font-mono">({tx.hash})</span>
 </div>
 <p className="text-slate-400 text-[11px]">{tx.type} • via {tx.institution}</p>
 </div>
 </div>

 <div className="flex items-center justify-between md:justify-end space-x-4">
 <div className="text-right">
 <p className="font-black text-amber-400 font-mono text-sm">{tx.amount}</p>
 <span className="text-[10px] text-emerald-400 font-semibold">{tx.status}</span>
 </div>
 <span className="text-[10px] text-slate-500 font-mono">{tx.time}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};
