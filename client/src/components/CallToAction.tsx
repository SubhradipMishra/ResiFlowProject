import React from 'react';

interface CallToActionProps {
  onGetStarted?: () => void;
  onContactSales?: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted, onContactSales }) => {
  return (
    <section className="py-24 md:py-36 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Flat Dark CTA Card */}
        <div className="relative rounded-[40px] p-8 sm:p-14 lg:p-16 overflow-hidden bg-teal-950 border-2 border-slate-900 text-white">

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Core Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-slate-900 border-2 border-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Free 30-day pilot • Instant onboarding</span>
              </div>

              {/* Big Headline */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                Ready to upgrade your <br />
                residential experience?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Join over 100+ residential societies and 50,000+ happy residents enjoying automated gate security, instant digital dues, and frictionless living.
              </p>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
                <div className="bg-teal-900 p-3 rounded-2xl border border-white/15">
                  <div className="text-emerald-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-flashlight-fill"></i>
                    <span>48 Hours</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Quick Society Setup</div>
                </div>

                <div className="bg-teal-900 p-3 rounded-2xl border border-white/15">
                  <div className="text-sky-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-shield-check-fill"></i>
                    <span>99.98%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Gate Security SLA</div>
                </div>

                <div className="bg-teal-900 p-3 rounded-2xl border border-white/15">
                  <div className="text-amber-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-wallet-3-fill"></i>
                    <span>₹0</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Migration Fee</div>
                </div>

                <div className="bg-teal-900 p-3 rounded-2xl border border-white/15">
                  <div className="text-rose-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-lock-2-fill"></i>
                    <span>ISO 27001</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Certified Secure</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-9 py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Book Free Guided Demo</span>
                  <i className="ri-arrow-right-line text-lg group-hover:translate-x-1.5 transition-transform"></i>
                </button>

                <button
                  onClick={onContactSales}
                  className="px-7 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-transparent hover:bg-white/10 border-2 border-white/30 transition-colors"
                >
                  Contact Sales Team
                </button>
              </div>

            </div>

            {/* Right Column: Community Visual Frame */}
            <div className="lg:col-span-5 relative flex justify-center">

              <div className="relative w-full max-w-md">
                <div className="rounded-[32px] overflow-hidden border-2 border-white/20 relative aspect-[4/3] group">
                  <img
                    src="/assets/community_about.jpg"
                    alt="Smart Community Lifestyle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 bg-teal-950 p-3 rounded-2xl border-2 border-white/20 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                        <i className="ri-building-line"></i>
                      </div>
                      <div>
                        <div className="font-bold text-white">Green Valley Residency</div>
                        <div className="text-[10px] text-slate-400">420 Flats • 100% Automated</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToAction;