import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setRequiresOtp, clearTempAuth, setLoading } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';
import api from '../../services/api';
import { Building, ArrowRight, ShieldCheck, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { requiresOtp, tempEmail } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState<'resident' | 'admin' | 'staff' | 'super-admin'>('resident');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const endpoint = `/auth/login`;
            const response = await api.post(endpoint, { email, password });

            if (response.data.success && response.data.data.requiresOtp) {
                dispatch(setRequiresOtp({ email: response.data.data.email }));
                toast.success('Verification code sent to your email.');
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Network error. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const endpoint = `/auth/verify-otp`;
            const response = await api.post(endpoint, { email: tempEmail || email, otp });

            if (response.data.success) {
                dispatch(clearTempAuth());
                dispatch(setCredentials({ user: response.data.data.user }));
                toast.success('Signed in successfully!');
                navigate('/dashboard');
            } else {
                toast.error(response.data.message || 'OTP Verification failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Invalid or expired OTP.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const goBackToLogin = () => {
        dispatch(clearTempAuth());
        setOtp('');
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] relative flex flex-col items-center justify-center overflow-hidden p-4">

            {/* Flat logo header, matching the site nav */}
            <a href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center">
                    <Building className="h-4 w-4 text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    Resi<span className="text-rose-600">Flow.</span>
                </span>
            </a>

            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-[28px] overflow-hidden relative z-10 border-2 border-slate-900">

                {/* Left Side: Branding — flat teal block, same family as the hero's doodle panels */}
                <div className="hidden md:flex flex-col justify-between bg-teal-900 p-12 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-10 w-10 bg-rose-600 border-2 border-white rounded-xl flex items-center justify-center">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-white">Resi<span className="text-rose-500">Flow</span></span>
                        </div>

                        <h1 className="text-4xl font-extrabold leading-tight mb-6 tracking-tight text-white">
                            Modern Living,<br />Seamless Management
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-12">
                            The complete residential society management platform designed for administrators, residents, and security personnel.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/30">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-200">Secure Access</h3>
                                    <p className="text-xs text-slate-500">2FA token-based authentication</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/30">
                                    <Activity className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-200">Real-time Operations</h3>
                                    <p className="text-xs text-slate-500">Live complaint and visitor tracking</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form — flat, ink-bordered inputs */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    {!requiresOtp ? (
                        <>
                            <div className="mb-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-slate-900 text-xs font-extrabold text-slate-900 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                    <span className="uppercase tracking-wide">Secure Access</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 leading-[1.05]">Welcome back.</h2>
                                <p className="text-slate-500 text-sm">Please sign in to your account to continue.</p>
                            </div>

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
                                            className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-colors border-2 ${role === r.id
                                                ? 'bg-rose-600 text-white border-slate-900'
                                                : 'bg-white text-slate-600 border-slate-900 hover:bg-slate-100'
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-white border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-white border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-8 bg-slate-900 hover:bg-slate-700 text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 group border-2 border-slate-900"
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
                                className="mb-6 flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </button>

                            <div className="mb-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-slate-900 text-xs font-extrabold text-slate-900 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                    <span className="uppercase tracking-wide">Verification</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 leading-[1.05]">Confirm it's you.</h2>
                                <p className="text-slate-500 text-sm">
                                    We've sent a 6-digit code to <span className="font-bold text-slate-700">{tempEmail}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Verification Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-4 bg-white border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 transition-all text-slate-800 font-extrabold tracking-[0.5em] text-center text-xl placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-normal"
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || otp.length < 6}
                                    className="w-full mt-8 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 group border-2 border-slate-900"
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
                                    <button type="button" className="text-xs font-bold text-slate-900 hover:underline">
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