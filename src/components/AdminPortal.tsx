import React, { useState, useEffect } from 'react';
import { 
 Users, 
 ShieldAlert, 
 Trash2, 
 Ban, 
 CheckCircle, 
 Sliders, 
 TrendingUp, 
 Lock, 
 Server, 
 RefreshCw,
 Plus,
 Edit,
 X,
 Briefcase,
 Globe,
 Settings,
 HelpCircle
} from 'lucide-react';
import { UserAccount, LoanRequest, ProjectPitch } from '../types';

export const AdminPortal: React.FC = () => {
 const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'loans'>('users');

 // Directories state
 const [users, setUsers] = useState<UserAccount[]>([]);
 const [projects, setProjects] = useState<ProjectPitch[]>([]);
 const [loans, setLoans] = useState<LoanRequest[]>([]);
 
 const [loading, setLoading] = useState(true);

 // Modal control states
 const [userModal, setUserModal] = useState<{ open: boolean; type: 'add' | 'edit'; data?: UserAccount }>({ open: false, type: 'add' });
 const [projectModal, setProjectModal] = useState<{ open: boolean; type: 'add' | 'edit'; data?: ProjectPitch }>({ open: false, type: 'add' });
 const [loanModal, setLoanModal] = useState<{ open: boolean; data?: LoanRequest }>({ open: false });

 // User Form fields
 const [uName, setUName] = useState('');
 const [uEmail, setUEmail] = useState('');
 const [uPassword, setUPassword] = useState('');
 const [uRole, setURole] = useState<'borrower' | 'lender' | 'admin'>('borrower');
 const [uStatus, setUStatus] = useState<'Active' | 'Suspended'>('Active');

 // Project Form fields
 const [pTitle, setPTitle] = useState('');
 const [pTagline, setPTagline] = useState('');
 const [pCategory, setPCategory] = useState<ProjectPitch['category']>('Agriculture & AgriTech');
 const [pTarget, setPTarget] = useState(50000);
 const [pRoi, setPRoi] = useState(15);
 const [pMin, setPMin] = useState(250);
 const [pLocation, setPLocation] = useState('Harare, Zimbabwe');
 const [pCountry, setPCountry] = useState('Zimbabwe');
 const [pSummary, setPSummary] = useState('');

 // Loan Form fields
 const [lBorrower, setLBorrower] = useState('');
 const [lBusiness, setLBusiness] = useState('');
 const [lAmount, setLAmount] = useState(10000);
 const [lScore, setLScore] = useState(700);
 const [lPurpose, setLPurpose] = useState('');
 const [lStatus, setLStatus] = useState<LoanRequest['status']>('Bidding Active');

 const fetchData = async () => {
 setLoading(true);
 try {
 const [uRes, pRes, lRes] = await Promise.all([
 fetch('/api/admin/users'),
 fetch('/api/project-pitches'),
 fetch('/api/loan-requests')
 ]);

 const [uData, pData, lData] = await Promise.all([
 uRes.json(),
 pRes.json(),
 lRes.json()
 ]);

 if (Array.isArray(uData)) setUsers(uData);
 if (Array.isArray(pData)) setProjects(pData);
 if (Array.isArray(lData)) setLoans(lData);
 } catch (err) {
 console.error('Failed to load admin workspace data:', err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 }, []);

 // --- Users Handlers ---
 const handleOpenUserModal = (type: 'add' | 'edit', user?: UserAccount) => {
 setUserModal({ open: true, type, data: user });
 if (type === 'edit' && user) {
 setUName(user.name);
 setUEmail(user.email);
 setUPassword('');
 setURole(user.role);
 setUStatus(user.status);
 } else {
 setUName('');
 setUEmail('');
 setUPassword('Password123');
 setURole('borrower');
 setUStatus('Active');
 }
 };

 const handleUserSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const endpoint = userModal.type === 'add' ? '/api/admin/users' : `/api/admin/users/${userModal.data?.id}`;
 const payload = { name: uName, email: uEmail, password: uPassword || 'Password123', role: uRole, status: uStatus };

 try {
 const res = await fetch(endpoint, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 if (res.ok) {
 setUserModal({ open: false, type: 'add' });
 fetchData();
 }
 } catch (err) {
 console.error('Failed to save user account:', err);
 }
 };

 const handleToggleUserStatus = async (user: UserAccount) => {
 const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
 try {
 const res = await fetch(`/api/admin/users/${user.id}/status`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ status: newStatus })
 });
 if (res.ok) fetchData();
 } catch (err) {
 console.error('Failed to toggle status:', err);
 }
 };

 const handleDeleteUser = async (id: string) => {
 if (!confirm('Are you sure you want to delete this user?')) return;
 try {
 const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
 if (res.ok) fetchData();
 } catch (err) {
 console.error('Failed to delete user:', err);
 }
 };

 // --- Projects Handlers ---
 const handleOpenProjectModal = (type: 'add' | 'edit', proj?: ProjectPitch) => {
 setProjectModal({ open: true, type, data: proj });
 if (type === 'edit' && proj) {
 setPTitle(proj.title);
 setPTagline(proj.tagline);
 setPCategory(proj.category);
 setPTarget(proj.targetCapital);
 setPRoi(proj.projectedROI);
 setPMin(proj.minInvestment);
 setPLocation(proj.location);
 setPCountry(proj.country);
 setPSummary(proj.pitchSummary);
 } else {
 setPTitle('');
 setPTagline('High quality regional expansion project.');
 setPCategory('Agriculture & AgriTech');
 setPTarget(50000);
 setPRoi(16);
 setPMin(250);
 setPLocation('Harare, Zimbabwe');
 setPCountry('Zimbabwe');
 setPSummary('');
 }
 };

 const handleProjectSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const endpoint = projectModal.type === 'add' ? '/api/admin/projects' : `/api/admin/projects/${projectModal.data?.id}`;
 const payload = {
 title: pTitle,
 tagline: pTagline,
 category: pCategory,
 targetCapital: pTarget,
 projectedROI: pRoi,
 minInvestment: pMin,
 location: pLocation,
 country: pCountry,
 countryCode: pCountry === 'South Africa' ? 'ZA' : pCountry === 'Botswana' ? 'BW' : pCountry === 'Zambia' ? 'ZM' : 'ZW',
 pitchSummary: pSummary
 };

 try {
 const res = await fetch(endpoint, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 if (res.ok) {
 setProjectModal({ open: false, type: 'add' });
 fetchData();
 }
 } catch (err) {
 console.error('Failed to save project:', err);
 }
 };

 // --- Loans Handlers ---
 const handleOpenLoanModal = (loan: LoanRequest) => {
 setLoanModal({ open: true, data: loan });
 setLBorrower(loan.borrowerName);
 setLBusiness(loan.businessName);
 setLAmount(loan.amountRequested);
 setLScore(loan.creditScore);
 setLPurpose(loan.purpose);
 setLStatus(loan.status);
 };

 const handleLoanSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!loanModal.data) return;
 const endpoint = `/api/admin/loans/${loanModal.data.id}`;
 const payload = {
 borrowerName: lBorrower,
 businessName: lBusiness,
 amountRequested: lAmount,
 creditScore: lScore,
 purpose: lPurpose,
 status: lStatus
 };

 try {
 const res = await fetch(endpoint, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 if (res.ok) {
 setLoanModal({ open: false });
 fetchData();
 }
 } catch (err) {
 console.error('Failed to save loan adjustments:', err);
 }
 };

 return (
 <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
 
 {/* Control Panel Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8">
 <div className="space-y-2">
 <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
 <Lock className="w-4 h-4" />
 <span>ApexLend Governance Console</span>
 </div>
 <h2 className="text-3xl font-extrabold text-white">System Administration Panel</h2>
 <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
 Hostinger-style unified workbench. Modify database models, override underwriting holds, manage registry accounts, and oversee active SADC lending parameters directly.
 </p>
 </div>

 <button 
 onClick={fetchData}
 className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2.5 border hover: rounded-xl text-xs font-bold text-slate-200 transition cursor-pointer"
 >
 <RefreshCw className="w-4 h-4 text-emerald-400" />
 <span>Sync Live Datastores</span>
 </button>
 </div>

 {/* Directory Selector Wix Tabs */}
 <div className="flex space-x-1.5 border-b pb-4">
 {[
 { id: 'users', label: 'Users Registry', icon: <Users className="w-4 h-4" /> },
 { id: 'projects', label: 'Venture Pitches', icon: <Briefcase className="w-4 h-4" /> },
 { id: 'loans', label: 'Marketplace Loans', icon: <Sliders className="w-4 h-4" /> }
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
 activeTab === tab.id 
 ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/20' 
 : 'text-slate-400 hover:text-white hover: border border-transparent hover:'
 }`}
 >
 {tab.icon}
 <span>{tab.label}</span>
 </button>
 ))}
 </div>

 {/* Directory Workbench Workspace */}
 <div className="space-y-6">
 
 {/* --- USERS DIRECTORY TAB --- */}
 {activeTab === 'users' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg font-bold text-white">Registered Account Directory</h3>
 <p className="text-[10px] text-slate-500">Configure client logins, user roles, and operational clearance states.</p>
 </div>
 <button
 onClick={() => handleOpenUserModal('add')}
 className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl hover: border hover: text-xs font-bold text-emerald-400 transition cursor-pointer animate-pulse"
 >
 <Plus className="w-4 h-4" />
 <span>Add User Account</span>
 </button>
 </div>

 <div className="glass-card rounded-2xl border overflow-hidden ">
 {loading ? (
 <div className="p-12 text-center">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
 <p className="text-slate-500 text-xs">Querying Users Directory...</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b text-slate-400 font-bold uppercase text-[9px] tracking-wider">
 <th className="p-4">Name / E-mail</th>
 <th className="p-4 text-center">System Role</th>
 <th className="p-4 text-center">Underwriting Status</th>
 <th className="p-4 text-center">Admin Controls</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {users.map((user) => (
 <tr key={user.id} className="hover: transition">
 <td className="p-4">
 <p className="font-bold text-white">{user.name}</p>
 <span className="text-slate-500 text-[10px]">{user.email}</span>
 </td>
 <td className="p-4 text-center">
 <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
 user.role === 'admin' 
 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
 : user.role === 'lender'
 ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
 : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
 }`}>
 {user.role}
 </span>
 </td>
 <td className="p-4 text-center">
 <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
 user.status === 'Active' 
 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
 : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
 }`}>
 {user.status}
 </span>
 </td>
 <td className="p-4 text-center space-x-1.5 whitespace-nowrap">
 {user.role !== 'admin' ? (
 <>
 <button
 onClick={() => handleOpenUserModal('edit', user)}
 title="Edit Credentials / Details"
 className="p-1.5 rounded-lg border text-slate-350 hover:text-white hover: transition cursor-pointer"
 >
 <Edit className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => handleToggleUserStatus(user)}
 title={user.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
 className={`p-1.5 rounded-lg border transition cursor-pointer ${
 user.status === 'Active'
 ? 'bg-rose-950/20 border-rose-900/30 text-rose-450 hover:bg-rose-900/40'
 : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/40'
 }`}
 >
 <Ban className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => handleDeleteUser(user.id)}
 title="Delete User"
 className="p-1.5 rounded-lg border text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </>
 ) : (
 <span className="text-[10px] text-slate-500 font-semibold italic">Account Owner</span>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 )}

 {/* --- PROJECTS DIRECTORY TAB --- */}
 {activeTab === 'projects' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg font-bold text-white">Investment Venture Registry</h3>
 <p className="text-[10px] text-slate-500">Edit, add, and publish underwritten corporate expansion project pitches.</p>
 </div>
 <button
 onClick={() => handleOpenProjectModal('add')}
 className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl hover: border hover: text-xs font-bold text-emerald-400 transition cursor-pointer animate-pulse"
 >
 <Plus className="w-4 h-4" />
 <span>Publish New Project</span>
 </button>
 </div>

 <div className="glass-card rounded-2xl border overflow-hidden ">
 {loading ? (
 <div className="p-12 text-center">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
 <p className="text-slate-500 text-xs">Querying Project Registry...</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b text-slate-400 font-bold uppercase text-[9px] tracking-wider">
 <th className="p-4">Project Title / Sector</th>
 <th className="p-4 text-center">Target Capital</th>
 <th className="p-4 text-center">Projected ROI</th>
 <th className="p-4 text-center">Location</th>
 <th className="p-4 text-center">Admin Controls</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {projects.map((proj) => (
 <tr key={proj.id} className="hover: transition">
 <td className="p-4">
 <p className="font-bold text-white">{proj.title}</p>
 <span className="text-slate-500 text-[10px]">{proj.category}</span>
 </td>
 <td className="p-4 text-center font-mono font-bold text-white">
 ${proj.targetCapital.toLocaleString()}
 </td>
 <td className="p-4 text-center font-mono font-bold text-emerald-400">
 +{proj.projectedROI}% p.a.
 </td>
 <td className="p-4 text-center text-slate-350">
 {proj.location}
 </td>
 <td className="p-4 text-center whitespace-nowrap">
 <button
 onClick={() => handleOpenProjectModal('edit', proj)}
 title="Edit Project Metrics"
 className="p-1.5 rounded-lg border text-slate-350 hover:text-white hover: transition cursor-pointer"
 >
 <Edit className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 )}

 {/* --- LOANS DIRECTORY TAB --- */}
 {activeTab === 'loans' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg font-bold text-white">SME Credit Requests</h3>
 <p className="text-[10px] text-slate-500">Oversee, edit, and bypass active loan request parameters and matched bids.</p>
 </div>
 </div>

 <div className="glass-card rounded-2xl border overflow-hidden ">
 {loading ? (
 <div className="p-12 text-center">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
 <p className="text-slate-500 text-xs">Querying Loan Desks...</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b text-slate-400 font-bold uppercase text-[9px] tracking-wider">
 <th className="p-4">Borrower Name / Business</th>
 <th className="p-4 text-center">Amount (USD)</th>
 <th className="p-4 text-center">Credit Rating</th>
 <th className="p-4 text-center">Status</th>
 <th className="p-4 text-center">Admin Controls</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {loans.map((loan) => (
 <tr key={loan.id} className="hover: transition">
 <td className="p-4">
 <p className="font-bold text-white">{loan.borrowerName}</p>
 <span className="text-slate-500 text-[10px] block font-mono">{loan.businessName}</span>
 </td>
 <td className="p-4 text-center font-mono font-bold text-white">
 ${loan.amountRequested.toLocaleString()}
 </td>
 <td className="p-4 text-center text-slate-350">
 {loan.creditScore} ({loan.riskScore})
 </td>
 <td className="p-4 text-center">
 <span className={`px-2 py-0.5 rounded text-[9px] font-bold block ${
 loan.status === 'Funded' 
 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
 : loan.status === 'Bidding Active'
 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
 : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
 }`}>
 {loan.status}
 </span>
 </td>
 <td className="p-4 text-center whitespace-nowrap">
 <button
 onClick={() => handleOpenLoanModal(loan)}
 title="Override & Edit Parameters"
 className="p-1.5 rounded-lg border text-slate-350 hover:text-white hover: transition cursor-pointer"
 >
 <Edit className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 )}

 </div>

 {/* --- ADD/EDIT USER MODAL OVERLAY --- */}
 {userModal.open && (
 <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
 <div className="glass-card max-w-md w-full p-6 rounded-3xl border relative shadow-2xl bg-slate-905">
 <button 
 onClick={() => setUserModal({ open: false, type: 'add' })}
 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full border transition"
 >
 <X className="w-4 h-4" />
 </button>
 <h3 className="text-base font-bold text-white mb-4">
 {userModal.type === 'add' ? 'Create New User Account' : 'Modify User Details'}
 </h3>
 <form onSubmit={handleUserSubmit} className="space-y-4 text-xs">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
 <input 
 type="text" 
 value={uName}
 onChange={(e) => setUName(e.target.value)}
 placeholder="e.g. John Doe"
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
 <input 
 type="email" 
 value={uEmail}
 onChange={(e) => setUEmail(e.target.value)}
 placeholder="name@apexlend.ai"
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Password</label>
 <input 
 type="text" 
 value={uPassword}
 onChange={(e) => setUPassword(e.target.value)}
 placeholder={userModal.type === 'edit' ? 'Leave blank to keep password' : 'Enter account password'}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
 required={userModal.type === 'add'}
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
 <select
 value={uRole}
 onChange={(e) => setURole(e.target.value as any)}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#0F172A] text-white"
 >
 <option value="borrower">Borrower (SME)</option>
 <option value="lender">Lender (Bank)</option>
 <option value="admin">Administrator</option>
 </select>
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
 <select
 value={uStatus}
 onChange={(e) => setUStatus(e.target.value as any)}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#0F172A] text-white"
 >
 <option value="Active">Active</option>
 <option value="Suspended">Suspended</option>
 </select>
 </div>
 </div>

 <button
 type="submit"
 className="w-full py-3 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
 >
 Save User Details
 </button>
 </form>
 </div>
 </div>
 )}

 {/* --- ADD/EDIT PROJECT MODAL OVERLAY --- */}
 {projectModal.open && (
 <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
 <div className="glass-card max-w-lg w-full p-6 rounded-3xl border relative shadow-2xl bg-slate-905">
 <button 
 onClick={() => setProjectModal({ open: false, type: 'add' })}
 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full border transition"
 >
 <X className="w-4 h-4" />
 </button>
 <h3 className="text-base font-bold text-white mb-4">
 {projectModal.type === 'add' ? 'Publish SADC Project Venture' : 'Modify Project Venture Details'}
 </h3>
 <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
 <input 
 type="text" 
 value={pTitle}
 onChange={(e) => setPTitle(e.target.value)}
 placeholder="e.g. Kariba Solar Expansion"
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Project Tagline</label>
 <input 
 type="text" 
 value={pTagline}
 onChange={(e) => setPTagline(e.target.value)}
 placeholder="Brief description preview"
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Sector Category</label>
 <select
 value={pCategory}
 onChange={(e) => setPCategory(e.target.value as any)}
 className="w-full glass-input px-2 py-2 rounded-xl text-[10px] bg-[#0F172A] text-white"
 >
 <option value="Agriculture & AgriTech">Agriculture & AgriTech</option>
 <option value="Renewable Energy">Renewable Energy</option>
 <option value="Mining & Minerals">Mining & Minerals</option>
 <option value="Fintech & Digital Trade">Fintech & Digital Trade</option>
 <option value="Real Estate & Logistics">Real Estate & Logistics</option>
 </select>
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Target Capital ($)</label>
 <input 
 type="number" 
 value={pTarget}
 onChange={(e) => setPTarget(Number(e.target.value))}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Projected ROI (% p.a.)</label>
 <input 
 type="number" 
 value={pRoi}
 onChange={(e) => setPRoi(Number(e.target.value))}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Min Ticket size ($)</label>
 <input 
 type="number" 
 value={pMin}
 onChange={(e) => setPMin(Number(e.target.value))}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Region Location</label>
 <input 
 type="text" 
 value={pLocation}
 onChange={(e) => setPLocation(e.target.value)}
 placeholder="City, Country"
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">SADC Nation</label>
 <select
 value={pCountry}
 onChange={(e) => setPCountry(e.target.value)}
 className="w-full glass-input px-2 py-2 rounded-xl text-xs bg-[#0F172A] text-white"
 >
 <option value="Zimbabwe">Zimbabwe</option>
 <option value="South Africa">South Africa</option>
 <option value="Botswana">Botswana</option>
 <option value="Zambia">Zambia</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-slate-300 font-semibold mb-1">Project Executive Summary</label>
 <textarea 
 value={pSummary}
 onChange={(e) => setPSummary(e.target.value)}
 placeholder="Describe the operations, export channels, and compliance features of the venture."
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white h-24 resize-none"
 required
 />
 </div>

 <button
 type="submit"
 className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
 >
 Publish Project to Investors
 </button>
 </form>
 </div>
 </div>
 )}

 {/* --- EDIT/FIX LOAN MODAL OVERLAY --- */}
 {loanModal.open && loanModal.data && (
 <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
 <div className="glass-card max-w-md w-full p-6 rounded-3xl border relative shadow-2xl bg-slate-905">
 <button 
 onClick={() => setLoanModal({ open: false })}
 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full border transition"
 >
 <X className="w-4 h-4" />
 </button>
 <h3 className="text-base font-bold text-white mb-4">Fix / Override Credit File Parameters</h3>
 <form onSubmit={handleLoanSubmit} className="space-y-4 text-xs">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Borrower Full Name</label>
 <input 
 type="text" 
 value={lBorrower}
 onChange={(e) => setLBorrower(e.target.value)}
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Business Venture Name</label>
 <input 
 type="text" 
 value={lBusiness}
 onChange={(e) => setLBusiness(e.target.value)}
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Requested ($)</label>
 <input 
 type="number" 
 value={lAmount}
 onChange={(e) => setLAmount(Number(e.target.value))}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Credit Score</label>
 <input 
 type="number" 
 value={lScore}
 onChange={(e) => setLScore(Number(e.target.value))}
 className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
 required
 />
 </div>
 <div>
 <label className="block text-slate-300 font-semibold mb-1">Marketplace State</label>
 <select
 value={lStatus}
 onChange={(e) => setLStatus(e.target.value as any)}
 className="w-full glass-input px-2 py-2 rounded-xl text-xs bg-[#0F172A] text-white"
 >
 <option value="Under AI Underwriting">Under AI Underwriting</option>
 <option value="Bidding Active">Bidding Active</option>
 <option value="Funded">Funded</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-slate-300 font-semibold mb-1">Underwriting Purpose</label>
 <textarea 
 value={lPurpose}
 onChange={(e) => setLPurpose(e.target.value)}
 className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white h-20 resize-none"
 required
 />
 </div>

 <button
 type="submit"
 className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
 >
 Apply Administrative Override
 </button>
 </form>
 </div>
 </div>
 )}

 </section>
 );
};
