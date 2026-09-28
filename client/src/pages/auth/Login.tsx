import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setRequiresOtp, clearTempAuth, setLoading } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';
import api from '../../services/api';
import { 
    Building, 
    ArrowRight, 
    ShieldCheck, 
    Activity, 
    ArrowLeft, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    Sparkles, 
    RefreshCw, 
    CheckCircle2,
    KeyRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { requiresOtp, tempEmail } = useSelector((state: RootState) => state.auth);

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 6-digit OTP individual boxes
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend countdown timer
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    // Handle timer countdown when on OTP step
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (requiresOtp && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [requiresOtp, resendTimer]);

    // Auto-focus first OTP input when transitioning to OTP step
    useEffect(() => {
        if (requiresOtp) {
            setOtpDigits(['', '', '', '', '', '']);
            setResendTimer(60);
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 150);
        }
    }, [requiresOtp]);

    // Step 1: Login with Email + Password
    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            toast.warning('Please enter both email and password.');
            return;
        }

        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password: password.trim(),
            });

            if (response.data.success && response.data.data.requiresOtp) {
                dispatch(setRequiresOtp({ email: response.data.data.email }));
                toast.success('Verification code dispatched to your email.');
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Invalid credentials or server error.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    // Handle single OTP digit change
    const handleOtpChange = (index: number, value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned) {
            const newDigits = [...otpDigits];
            newDigits[index] = '';
            setOtpDigits(newDigits);
            return;
        }

        // If user pasted multi-digit text into one box
        if (cleaned.length > 1) {
            const pastedArray = cleaned.slice(0, 6).split('');
            const newDigits = [...otpDigits];
            pastedArray.forEach((char, i) => {
                if (i < 6) newDigits[i] = char;
            });
            setOtpDigits(newDigits);
            const nextIndex = Math.min(pastedArray.length, 5);
            otpInputRefs.current[nextIndex]?.focus();
            return;
        }

        const newDigits = [...otpDigits];
        newDigits[index] = cleaned[0];
        setOtpDigits(newDigits);

        // Auto-advance to next input
        if (index < 5 && cleaned.length > 0) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    // Handle Backspace navigation across OTP boxes
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle global paste into OTP boxes
    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newDigits = ['', '', '', '', '', ''];
            pastedData.split('').forEach((char, i) => {
                if (i < 6) newDigits[i] = char;
            });
            setOtpDigits(newDigits);
            const focusIndex = Math.min(pastedData.length, 5);
            otpInputRefs.current[focusIndex]?.focus();
        }
    };

    const fullOtp = otpDigits.join('');

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fullOtp.length < 6) {
            toast.warning('Please enter the full 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            const response = await api.post('/auth/verify-otp', {
                email: tempEmail || email.trim().toLowerCase(),
                otp: fullOtp,
            });

            if (response.data.success) {
                dispatch(clearTempAuth());
                dispatch(setCredentials({ user: response.data.data.user }));
                toast.success('Signed in successfully! Welcome back.');
                navigate('/dashboard');
            } else {
                toast.error(response.data.message || 'OTP verification failed');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Invalid or expired OTP code.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    // Resend OTP Action
    const handleResendOtp = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        try {
            const targetEmail = tempEmail || email.trim().toLowerCase();
            const res = await api.post('/auth/resend-otp', { email: targetEmail });
            if (res.data?.success) {
                toast.success('A fresh 6-digit code was sent to your email.');
                setResendTimer(60);
                setOtpDigits(['', '', '', '', '', '']);
                otpInputRefs.current[0]?.focus();
            } else {
                toast.error(res.data?.message || 'Could not resend OTP.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsResending(false);
        }
    };

    const goBackToLogin = () => {
        dispatch(clearTempAuth());
        setOtpDigits(['', '', '', '', '', '']);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] relative flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none -z-0"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-rose-100/60 rounded-full blur-3xl pointer-events-none -z-0"></div>

            {/* Flat Logo Header */}
            <a href="/" className="flex items-center gap-2.5 mb-6 md:mb-8 relative z-10 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <Building className="h-5 w-5 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tight text-slate-900">
                    Resi<span className="text-rose-600">Flow.</span>
                </span>
            </a>

            {/* Main Auth Card Container */}
            <div className="w-full max-w-[1020px] grid grid-cols-1 md:grid-cols-12 bg-white rounded-[32px] overflow-hidden relative z-10 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all duration-300">

                {/* Left Side: Branding & Feature Badges */}
                <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-teal-900 p-10 lg:p-12 text-white relative overflow-hidden">
                    {/* Background Pattern Grid */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute -right-16 -top-16 w-56 h-56 bg-rose-600/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-12">
                            <div className="h-9 w-9 bg-rose-600 border-2 border-white rounded-xl flex items-center justify-center shadow-sm">
                                <Building className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">Resi<span className="text-rose-400">Flow</span></span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-teal-200 mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Enterprise Residence Suite</span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-4 tracking-tight text-white">
                            Modern Living,<br />
                            <span className="text-teal-300">Seamless Control.</span>
                        </h1>
                        <p className="text-teal-100/80 text-xs sm:text-sm leading-relaxed mb-10">
                            Unified society access for Residents, Admins, Staff, and SuperAdmins.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 text-emerald-300 shrink-0">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-xs text-white">2-Factor Security</h3>
                                    <p className="text-[11px] text-teal-200/70">Encrypted tokenized 2FA authentication</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/30 text-amber-300 shrink-0">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-xs text-white">Real-time Operations</h3>
                                    <p className="text-[11px] text-teal-200/70">Instant notice & facility updates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-200/60 font-semibold">
                        <span>© {new Date().getFullYear()} ResiFlow Platform</span>
                        <span className="flex items-center gap-1.5 text-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            System Live
                        </span>
                    </div>
                </div>

                {/* Right Side: Sign In Form & OTP Step */}
                <div className="md:col-span-7 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white relative">
                    {!requiresOtp ? (
                        /* STEP 1: Direct Email & Password Form */
                        <div className="animate-fadeIn">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-black text-slate-800 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                                    <span className="uppercase tracking-wider">Single Sign-On</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Welcome back
                                </h2>
                                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                    Enter your credentials to access your society portal.
                                </p>
                            </div>

                            <form onSubmit={handleLoginStep1} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 hover:bg-white border-2 border-slate-900 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-600 transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="you@society.com"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Password Field with Visibility Toggle */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3.5 bg-slate-50/50 hover:bg-white border-2 border-slate-900 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-600 transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-800 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-6 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] border-2 border-slate-900 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Continue to Verification</span>
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* STEP 2: Stylish Animated 2FA OTP Verification */
                        <div className="animate-fadeIn">
                            <button
                                onClick={goBackToLogin}
                                className="mb-6 inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50 hover:bg-white cursor-pointer"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Change Email / Back</span>
                            </button>

                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-black text-amber-900 mb-3">
                                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="uppercase tracking-wider">Two-Factor Authentication</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Enter 6-Digit Code
                                </h2>
                                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                    A temporary login code was sent to:
                                </p>
                                <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                                    <span>{tempEmail || email}</span>
                                </div>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                {/* Segmented 6-Box OTP Input */}
                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-3 text-center sm:text-left">
                                        Security Verification Code
                                    </label>
                                    <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                                        {otpDigits.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => {
                                                    otpInputRefs.current[idx] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all outline-none ${
                                                    digit
                                                        ? 'bg-rose-50/40 border-rose-600 text-rose-600 shadow-[2px_2px_0px_0px_rgba(225,29,72,1)]'
                                                        : 'bg-slate-50/50 border-slate-900 text-slate-900 focus:border-rose-600 focus:bg-white focus:ring-4 focus:ring-rose-500/20'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Verify Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || fullOtp.length < 6}
                                    className="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Verify & Complete Login</span>
                                            <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Resend Code Section with Countdown */}
                                <div className="text-center pt-2">
                                    {resendTimer > 0 ? (
                                        <p className="text-xs font-semibold text-slate-500">
                                            Resend available in <span className="font-bold text-slate-900">{resendTimer}s</span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={isResending}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-700 hover:underline transition-all cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                                            <span>Didn't receive code? Resend OTP</span>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;