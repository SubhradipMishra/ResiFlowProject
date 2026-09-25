import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setRequiresOtp, clearTempAuth, setLoading, setError } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';
import api from '../../services/api';
import { Building, ArrowRight, ShieldCheck, Activity, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { requiresOtp, tempEmail } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState<'resident' | 'admin' | 'staff' | 'super-admin'>('resident');
    const [localError, setLocalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getEndpointBase = () => {
        if (role === 'admin') return '/admin';
        if (role === 'staff') return '/staff';
        if (role === 'super-admin') return '/super-admin';
        return '/resident';
    };

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const endpoint = `/auth/login`;
            const response = await api.post(endpoint, { email, password });

            if (response.data.success && response.data.data.requiresOtp) {
                dispatch(setRequiresOtp({ email: response.data.data.email }));
            } else {
                setLocalError(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Network error. Please try again.';
            setLocalError(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const endpoint = `/auth/verify-otp`;
            const response = await api.post(endpoint, { email: tempEmail || email, otp });

            if (response.data.success) {
                dispatch(clearTempAuth());
                dispatch(setCredentials({ user: response.data.data.user }));
                navigate('/dashboard');
            } else {
                setLocalError(response.data.message || 'OTP Verification failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Invalid or expired OTP.';
            setLocalError(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const goBackToLogin = () => {
        dispatch(clearTempAuth());
        setOtp('');
        setLocalError('');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] bg-grid-pattern relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-rose-100/40 rounded-full blur-[80px]" />

            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 mx-4">

                {/* Left Side: Branding */}
                <div className="hidden md:flex flex-col justify-between bg-[#0f172a] p-12 text-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-gradient-to-tl from-[#be123c]/20 to-transparent opacity-60" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Building className="h-6 w-6 text-[#0f172a]" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">ResiFlow</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight text-white">
                            Modern Living,<br />Seamless Management
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-12">
                            The complete residential society management platform designed for administrators, residents, and security personnel.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-slate-200">Secure Access</h3>
                                    <p className="text-xs text-slate-500">2FA token-based authentication</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                    <Activity className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-slate-200">Real-time Operations</h3>
                                    <p className="text-xs text-slate-500">Live complaint and visitor tracking</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    {!requiresOtp ? (
                        <>
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-2">Welcome Back</h2>
                                <p className="text-slate-500 text-sm">Please sign in to your account to continue.</p>
                            </div>

                            {localError && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-rose-600 text-xs font-bold">!</span>
                                    </div>
                                    <p className="text-sm text-rose-700 font-medium">{localError}</p>
                                </div>
                            )}

                            <form onSubmit={handleLoginStep1} className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    {[
                                        { id: 'resident', label: 'Resident' },
                                        { id: 'admin', label: 'Admin' },
                                        { id: 'staff', label: 'Staff' },
                                        { id: 'super-admin', label: 'Super Admin' }
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id as any)}
                                            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${role === r.id
                                                ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md shadow-slate-200'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-8 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 group shadow-lg shadow-slate-200"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        // OTP Verification Step
                        <>
                            <button
                                onClick={goBackToLogin}
                                className="mb-6 flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f172a] transition-colors w-fit"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </button>

                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-2">Two-Factor Authentication</h2>
                                <p className="text-slate-500 text-sm">
                                    We've sent a 6-digit code to <span className="font-semibold text-slate-700">{tempEmail}</span>
                                </p>
                            </div>

                            {localError && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-rose-600 text-xs font-bold">!</span>
                                    </div>
                                    <p className="text-sm text-rose-700 font-medium">{localError}</p>
                                </div>
                            )}

                            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verification Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] transition-all text-slate-800 font-bold tracking-[0.5em] text-center text-xl placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-normal"
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || otp.length < 6}
                                    className="w-full mt-8 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 group shadow-lg shadow-rose-200"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Verify & Proceed
                                            <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <div className="text-center mt-4">
                                    <button type="button" className="text-xs font-semibold text-[#0f172a] hover:underline">
                                        Didn't receive the code? Resend
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
