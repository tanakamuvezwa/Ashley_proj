import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles, UserCheck, User, Shield } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
 initialTab?: 'login' | 'register';
 onClose: () => void;
 onLoginSuccess: (user: UserAccount) => void;
}

interface FieldErrors {
 name?: string;
 email?: string;
 password?: string;
 role?: string;
}

const isValidEmail = (email: string) =>
 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
 if (pw.length === 0) return { score: 0, label: '', color: '' };
 let score = 0;
 if (pw.length >= 8) score++;
 if (pw.length >= 12) score++;
 if (/[A-Z]/.test(pw)) score++;
 if (/[0-9]/.test(pw)) score++;
 if (/[^A-Za-z0-9]/.test(pw)) score++;
 if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
 if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
 return { score, label: 'Strong', color: 'bg-emerald-500' };
};

export const LoginModal: React.FC<LoginModalProps> = ({
 initialTab = 'login',
 onClose,
 onLoginSuccess
}) => {
 const [activeMode, setActiveMode] = useState<'login' | 'register'>(initialTab);
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [role, setRole] = useState<'borrower' | 'lender'>('borrower');
 const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
 const [globalError, setGlobalError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [touched, setTouched] = useState<Record<string, boolean>>({});

 const pwStrength = getPasswordStrength(password);

 // Per-field validation
 const validateField = (field: string, value: string): string | undefined => {
 switch (field) {
 case 'name':
 if (!value.trim()) return 'Full name is required';
 if (value.trim().length < 2) return 'Name must be at least 2 characters';
 return undefined;
 case 'email':
 if (!value) return 'Email address is required';
 if (!isValidEmail(value)) return 'Please enter a valid email address';
 return undefined;
 case 'password':
 if (!value) return 'Password is required';
 if (activeMode === 'register' && value.length < 8) return 'Password must be at least 8 characters';
 return undefined;
 default:
 return undefined;
 }
 };

 const handleBlur = (field: string, value: string) => {
 setTouched(prev => ({ ...prev, [field]: true }));
 const error = validateField(field, value);
 setFieldErrors(prev => ({ ...prev, [field]: error }));
 };

 const handleChange = (field: string, value: string) => {
 if (field === 'name') setName(value);
 if (field === 'email') setEmail(value);
 if (field === 'password') setPassword(value);
 if (touched[field]) {
 const error = validateField(field, value);
 setFieldErrors(prev => ({ ...prev, [field]: error }));
 }
 setGlobalError(null);
 };

 const handleQuickLogin = (roleSelect: 'admin' | 'borrower' | 'lender') => {
 setActiveMode('login');
 const creds = {
 admin: { em: 'admin@apexlend.ai', pw: 'AdminPass123' },
 borrower: { em: 'ashley@apexlend.ai', pw: 'AshleyPass123' },
 lender: { em: 'lender@apexlend.ai', pw: 'LenderPass123' }
 };
 setEmail(creds[roleSelect].em);
 setPassword(creds[roleSelect].pw);
 setFieldErrors({});
 setGlobalError(null);
 setTouched({});
 };

 const validateAll = (): boolean => {
 const errors: FieldErrors = {};
 if (activeMode === 'register') {
 const nameErr = validateField('name', name);
 if (nameErr) errors.name = nameErr;
 }
 const emailErr = validateField('email', email);
 if (emailErr) errors.email = emailErr;
 const pwErr = validateField('password', password);
 if (pwErr) errors.password = pwErr;
 setFieldErrors(errors);
 setTouched({ name: true, email: true, password: true });
 return Object.keys(errors).length === 0;
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!validateAll()) return;
 setLoading(true);
 setGlobalError(null);
 const endpoint = activeMode === 'login' ? '/api/auth/login' : '/api/auth/register';
 const payload = activeMode === 'login' ? { email, password } : { name, email, password, role };
 try {
 const response = await fetch(endpoint, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 credentials: 'include',
 body: JSON.stringify(payload)
 });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Authentication failed');
 onLoginSuccess(data);
 onClose();
 } catch (err: any) {
 setGlobalError(err.message || 'An error occurred. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 const switchMode = (mode: 'login' | 'register') => {
 setActiveMode(mode);
 setFieldErrors({});
 setGlobalError(null);
 setTouched({});
 setName(''); setEmail(''); setPassword('');
 };

 const InputField = ({
 field, label, type, icon: Icon, placeholder, value
 }: {
 field: string; label: string; type: string; icon: any; placeholder: string; value: string;
 }) => {
 const hasError = touched[field] && fieldErrors[field as keyof FieldErrors];
 const isOk = touched[field] && !fieldErrors[field as keyof FieldErrors] && value;

 return (
 <div>
 <label className="flex items-center justify-between mb-1.5">
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
 {hasError && <span className="text-[9px] text-rose-400 font-semibold">{fieldErrors[field as keyof FieldErrors]}</span>}
 {isOk && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
 </label>
 <div className="relative">
 <Icon className={`absolute left-3 top-3 w-4 h-4 transition-colors ${hasError ? 'text-rose-500' : isOk ? 'text-emerald-500' : 'text-slate-500'}`} />
 <input
 type={field === 'password' && showPassword ? 'text' : type}
 value={value}
 onChange={e => handleChange(field, e.target.value)}
 onBlur={e => handleBlur(field, e.target.value)}
 placeholder={placeholder}
 autoComplete={field === 'password' ? 'current-password' : field === 'email' ? 'email' : 'name'}
 className={`w-full glass-input pl-10 pr-${field === 'password' ? '10' : '4'} py-2.5 rounded-xl text-xs text-white transition-all outline-none border ${
 hasError ? 'border-rose-500/50 focus:border-rose-500' :
 isOk ? 'border-emerald-500/40 focus:border-emerald-500' :
 ' focus:border-emerald-500/40'
 }`}
 />
 {field === 'password' && (
 <button
 type="button"
 onClick={() => setShowPassword(v => !v)}
 className="absolute right-3 top-3 text-slate-500 hover:text-white transition cursor-pointer"
 >
 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 )}
 </div>
 {/* Password strength meter */}
 {field === 'password' && activeMode === 'register' && password.length > 0 && (
 <div className="mt-1.5 flex items-center space-x-2">
 <div className="flex space-x-0.5 flex-1">
 {[1,2,3,4,5].map(i => (
 <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i <= pwStrength.score ? pwStrength.color : ''}`} />
 ))}
 </div>
 <span className={`text-[9px] font-bold shrink-0 ${pwStrength.score <= 1 ? 'text-rose-400' : pwStrength.score <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
 {pwStrength.label}
 </span>
 </div>
 )}
 </div>
 );
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
 <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border relative shadow-2xl animate-in">

 {/* Close Button */}
 <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition border cursor-pointer">
 <X className="w-4 h-4" />
 </button>

 {/* Tab Switcher */}
 <div className="flex border p-0.5 rounded-xl mb-6 text-xs font-bold font-mono">
 {(['login', 'register'] as const).map(mode => (
 <button
 key={mode}
 onClick={() => switchMode(mode)}
 className={`flex-1 py-2.5 rounded-lg transition uppercase text-center cursor-pointer ${
 activeMode === mode ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
 }`}
 >
 {mode === 'login' ? 'Sign In' : 'Register'}
 </button>
 ))}
 </div>

 {/* Header */}
 <div className="flex items-center space-x-3 mb-6">
 <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
 <Shield className="w-5 h-5 text-emerald-400" />
 </div>
 <div>
 <h3 className="text-lg font-extrabold text-white">
 {activeMode === 'login' ? 'Welcome back' : 'Create account'}
 </h3>
 <p className="text-[10px] text-slate-400">
 {activeMode === 'login'
 ? "Sign in to your ApexLend workspace"
 : "Join SADC's leading capital marketplace"}
 </p>
 </div>
 </div>

 {/* Developer Quick Logins */}
 {activeMode === 'login' && (
 <div className="mb-5 p-3.5 rounded-xl border ">
 <div className="flex items-center space-x-1 mb-2.5">
 <Sparkles className="w-3 h-3 text-amber-400" />
 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Quick Login Presets</span>
 </div>
 <div className="grid grid-cols-3 gap-1.5">
 {[
 { role: 'admin' as const, label: 'Admin', color: 'text-amber-400 border-amber-500/20 hover:border-amber-400' },
 { role: 'borrower' as const, label: 'Borrower', color: 'text-emerald-400 border-emerald-500/20 hover:border-emerald-400' },
 { role: 'lender' as const, label: 'Lender', color: 'text-sky-400 border-sky-500/20 hover:border-sky-400' }
 ].map(({ role: r, label, color }) => (
 <button
 key={r}
 type="button"
 onClick={() => handleQuickLogin(r)}
 className={`py-1.5 rounded-lg text-[9px] font-bold border cursor-pointer hover: transition ${color}`}
 >
 {label}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Global Error */}
 {globalError && (
 <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] flex items-start space-x-2">
 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
 <span>{globalError}</span>
 </div>
 )}

 {/* Form */}
 <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
 {activeMode === 'register' && (
 <InputField field="name" label="Full Name" type="text" icon={User} placeholder="John Doe" value={name} />
 )}
 <InputField field="email" label="Email Address" type="email" icon={Mail} placeholder="you@company.com" value={email} />
 <InputField field="password" label="Password" type="password" icon={Lock} placeholder="••••••••" value={password} />

 {activeMode === 'register' && (
 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
 <select
 value={role}
 onChange={e => setRole(e.target.value as any)}
 className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white bg-[#0F172A] border focus:border-emerald-500/40 outline-none cursor-pointer"
 >
 <option value="borrower">Borrower — SADC SME seeking capital</option>
 <option value="lender">Lender — Bank or Financial Fund</option>
 </select>
 </div>
 )}

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3.5 mt-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer border border-emerald-400/20 hover:from-emerald-400 hover:to-teal-400"
 >
 {loading ? (
 <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
 ) : (
 <>
 <UserCheck className="w-4 h-4" />
 <span>{activeMode === 'login' ? 'Sign In Securely' : 'Create Account'}</span>
 </>
 )}
 </button>
 </form>

 <p className="text-center text-[9px] text-slate-600 mt-5">
 Protected by JWT authentication • Passwords hashed with bcrypt
 </p>
 </div>
 </div>
 );
};
