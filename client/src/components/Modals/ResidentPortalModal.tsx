import React, { useState } from 'react';

interface ResidentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResidentPortalModal: React.FC<ResidentPortalModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<'resident' | 'admin' | 'guard'>('resident');
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setOtpSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              <i className="ri-shield-user-fill"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Welcome Back, Rahul!</h3>
            <p className="text-xs text-slate-500">Redirecting to your Resident Dashboard (Flat A-502)...</p>
          </div>
        ) : (
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-rose-500 flex items-center justify-center text-white text-xl shadow-md mb-3">
              <i className="ri-community-line"></i>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">
              Sign In to <span className="text-brand-600">ResiFlow</span>
            </h3>

            {/* Role switch */}
            <div className="mt-4 grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('resident')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'resident' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Resident
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'admin' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                RWA Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('guard')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'guard' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Gate Guard
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all"
                >
                  Send Verification OTP →
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 4-Digit OTP sent to +91 {phone}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. 5021"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="text-[11px] text-slate-400 text-center mt-1.5">
                    Demo OTP: Enter any 4 digits to proceed
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all"
                >
                  Verify & Access Portal
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
