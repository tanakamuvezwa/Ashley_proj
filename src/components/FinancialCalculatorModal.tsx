import React, { useState } from 'react';
import { 
 Calculator, 
 X, 
 TrendingUp, 
 DollarSign, 
 Calendar, 
 Percent, 
 FileText,
 CheckCircle2,
 PieChart
} from 'lucide-react';

interface FinancialCalculatorModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({
 isOpen,
 onClose
}) => {
 const [calcMode, setCalcMode] = useState<'loan' | 'investment'>('loan');
 
 // Loan state
 const [loanPrincipal, setLoanPrincipal] = useState<number>(30000);
 const [loanInterestRate, setLoanInterestRate] = useState<number>(7.5);
 const [loanTenureMonths, setLoanTenureMonths] = useState<number>(24);

 // Investment state
 const [investPrincipal, setInvestPrincipal] = useState<number>(10000);
 const [investYieldRate, setInvestYieldRate] = useState<number>(18.5);
 const [investYears, setInvestYears] = useState<number>(3);

 if (!isOpen) return null;

 // Loan Calculations (Amortization formula)
 const monthlyRate = (loanInterestRate / 100) / 12;
 const monthlyLoanPayment = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) / (Math.pow(1 + monthlyRate, loanTenureMonths) - 1);
 const totalLoanRepayment = monthlyLoanPayment * loanTenureMonths;
 const totalLoanInterest = totalLoanRepayment - loanPrincipal;

 // Investment Calculations (Compound interest formula A = P(1 + r/n)^(nt))
 const totalInvestReturnValue = investPrincipal * Math.pow(1 + (investYieldRate / 100), investYears);
 const totalInvestProfit = totalInvestReturnValue - investPrincipal;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
 <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border-emerald-500/40 relative shadow-2xl overflow-y-auto max-h-[90vh]">
 
 {/* Close Button */}
 <button 
 onClick={onClose}
 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full "
 >
 <X className="w-5 h-5" />
 </button>

 {/* Header */}
 <div className="flex items-center space-x-3 mb-6">
 <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
 <Calculator className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-extrabold text-white">SADC Financial Calculator</h3>
 <p className="text-xs text-slate-400">Calculate loan amortization schedules and investment yield returns.</p>
 </div>
 </div>

 {/* Mode Selector Tabs */}
 <div className="flex p-1.5 rounded-2xl border border-slate-800 mb-6">
 <button
 onClick={() => setCalcMode('loan')}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
 calcMode === 'loan'
 ? 'bg-emerald-500 text-slate-950 shadow'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 Loan Amortization Calculator
 </button>
 <button
 onClick={() => setCalcMode('investment')}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
 calcMode === 'investment'
 ? 'bg-emerald-500 text-slate-950 shadow'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 Project Investment Yield Calculator
 </button>
 </div>

 {/* Loan Amortization Mode */}
 {calcMode === 'loan' ? (
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Loan Amount ($ USD)</label>
 <input
 type="number"
 value={loanPrincipal}
 onChange={(e) => setLoanPrincipal(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Annual Interest (% APR)</label>
 <input
 type="number"
 step="0.1"
 value={loanInterestRate}
 onChange={(e) => setLoanInterestRate(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tenure (Months)</label>
 <input
 type="number"
 value={loanTenureMonths}
 onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>
 </div>

 {/* Results Card */}
 <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Payment</span>
 <p className="text-xl font-black text-emerald-400 font-mono">${Math.round(monthlyLoanPayment).toLocaleString()}</p>
 </div>

 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Interest Payed</span>
 <p className="text-xl font-black text-amber-400 font-mono">${Math.round(totalLoanInterest).toLocaleString()}</p>
 </div>

 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Repayment Amount</span>
 <p className="text-xl font-black text-white font-mono">${Math.round(totalLoanRepayment).toLocaleString()}</p>
 </div>
 </div>

 {/* Simulated Amortization Schedule Table Snippet */}
 <div>
 <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Amortization Schedule Preview (First 4 Months)</h4>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead className=" text-slate-400">
 <tr>
 <th className="p-2">Month</th>
 <th className="p-2">Payment</th>
 <th className="p-2">Principal Paid</th>
 <th className="p-2">Interest Paid</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
 {[1, 2, 3, 4].map((m) => {
 const interestForMonth = (loanPrincipal * monthlyRate);
 const principalForMonth = monthlyLoanPayment - interestForMonth;
 return (
 <tr key={m}>
 <td className="p-2 font-bold text-white">Month {m}</td>
 <td className="p-2">${Math.round(monthlyLoanPayment)}</td>
 <td className="p-2 text-emerald-400">${Math.round(principalForMonth)}</td>
 <td className="p-2 text-amber-400">${Math.round(interestForMonth)}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 ) : (
 /* Investment Yield Mode */
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Principal Capital ($ USD)</label>
 <input
 type="number"
 value={investPrincipal}
 onChange={(e) => setInvestPrincipal(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projected Annual Yield (%)</label>
 <input
 type="number"
 step="0.5"
 value={investYieldRate}
 onChange={(e) => setInvestYieldRate(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Holding Period (Years)</label>
 <input
 type="number"
 value={investYears}
 onChange={(e) => setInvestYears(Number(e.target.value))}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
 />
 </div>
 </div>

 {/* Results Card */}
 <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Initial Capital</span>
 <p className="text-xl font-black text-white font-mono">${investPrincipal.toLocaleString()}</p>
 </div>

 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Profit Earned</span>
 <p className="text-xl font-black text-emerald-400 font-mono">+${Math.round(totalInvestProfit).toLocaleString()}</p>
 </div>

 <div>
 <span className="text-[10px] text-slate-400 uppercase font-semibold block">Maturity Portfolio Value</span>
 <p className="text-xl font-black text-amber-400 font-mono">${Math.round(totalInvestReturnValue).toLocaleString()}</p>
 </div>
 </div>
 </div>
 )}

 </div>
 </div>
 );
};
