import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, defaultPlan }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    societyName: '',
    flatsCount: '250',
    city: 'Bengaluru',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              <i className="ri-checkbox-circle-fill"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Demo Scheduled!</h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Thank you {formData.name || 'Resident Leader'}. Our society onboarding specialist will call you shortly on {formData.phone || 'your phone'}.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <i className="ri-building-line"></i>
              <span>Schedule Live Society Walkthrough</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">
              Get Started with <span className="text-brand-600">ResiFlow</span>
            </h3>

            {defaultPlan && (
              <div className="mt-2 text-xs font-semibold text-slate-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 inline-block">
                Selected Plan: <span className="text-brand-700 font-bold">{defaultPlan}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Society / Apartment Complex Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Green Valley Residency"
                  value={formData.societyName}
                  onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Flats / Units</label>
                  <select
                    value={formData.flatsCount}
                    onChange={(e) => setFormData({ ...formData, flatsCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium"
                  >
                    <option value="50">Under 50 Flats</option>
                    <option value="150">50 - 200 Flats</option>
                    <option value="400">200 - 500 Flats</option>
                    <option value="1000">500+ Flats</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/30 hover:shadow-lg transition-all"
                >
                  Book Free 1-on-1 Guided Demo →
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  🔒 No credit card required. Free 30-day society pilot included.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
