import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#e11d48', '#be123c', '#10b981', '#3b82f6', '#f59e0b'],
      });
    }, 1200);
  };

  const handleDone = () => {
    setPaid(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {paid ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto animate-bounce">
              <i className="ri-check-line"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Transaction ID: <span className="font-mono font-bold text-slate-700">SR-TXN-2026-98741</span>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Paid For:</span>
                <span className="font-bold text-slate-800">Monthly Society Maintenance (Oct 2026)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flat / Unit:</span>
                <span className="font-semibold text-slate-800">Rahul Sharma (A-502)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-600">₹2,500.00</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Close & View Digital Receipt
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <i className="ri-secure-payment-line text-base"></i>
              <span>ResiFlow Secure Payment</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Pay Society Maintenance
            </h3>

            {/* Dues summary */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Flat A-502 (Rahul Sharma)</div>
                <div className="text-sm font-bold text-slate-800">Green Valley Residency</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Due</div>
                <div className="text-lg font-extrabold text-brand-600">₹2,500</div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="mt-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Choose Payment Method</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    method === 'upi'
                      ? 'border-brand-600 bg-brand-50/60 text-brand-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 text-xs'
                  }`}
                >
                  <i className="ri-qr-code-line text-lg block"></i>
                  <span className="text-[11px]">Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    method === 'card'
                      ? 'border-brand-600 bg-brand-50/60 text-brand-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 text-xs'
                  }`}
                >
                  <i className="ri-bank-card-line text-lg block"></i>
                  <span className="text-[11px]">Card / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    method === 'netbanking'
                      ? 'border-brand-600 bg-brand-50/60 text-brand-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 text-xs'
                  }`}
                >
                  <i className="ri-bank-line text-lg block"></i>
                  <span className="text-[11px]">NetBanking</span>
                </button>
              </div>
            </div>

            {/* UPI Mock field */}
            {method === 'upi' && (
              <div className="mt-4 p-3 bg-brand-50/40 rounded-xl border border-brand-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-brand-600 font-bold">
                    UPI
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">GPay / PhonePe / Paytm</div>
                    <div className="text-[10px] text-slate-500">Auto-routed via Society Escrow Account</div>
                  </div>
                </div>
                <span className="text-emerald-600 font-bold text-[11px]">0% Convenience Fee</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="mt-6">
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base"></i>
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-shield-check-line text-base"></i>
                    <span>Pay ₹2,500 via Verified Gateway</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
