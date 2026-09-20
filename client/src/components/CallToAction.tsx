import React from 'react';

interface CallToActionProps {
  onGetStarted: () => void;
  onContactSales: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted, onContactSales }) => {
  return (
    <section className="py-24 md:py-36 bg-[#F8FAFC] relative overflow-hidden bg-dot-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Radiant Dark Luxury CTA Card */}
        <div className="relative rounded-[40px] p-8 sm:p-14 lg:p-16 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-navy-950 border border-slate-800 shadow-2xl text-white">
          
          {/* Radiant Ambient Neon Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Core Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800/80 text-brand-300 border border-slate-700 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>FREE 30-DAY PILOT • INSTANT ONBOARDING</span>
              </div>

              {/* Big Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                Ready to Upgrade Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-rose-400 to-pink-300">
                  Residential Experience?
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Join over 100+ residential societies and 50,000+ happy residents enjoying automated gate security, instant digital dues, and frictionless living.
              </p>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-emerald-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-flashlight-fill"></i>
                    <span>48 Hours</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Quick Society Setup</div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-sky-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-shield-check-fill"></i>
                    <span>99.98%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Gate Security SLA</div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-amber-400 text-base font-extrabold flex items-center gap-1">
                    <i className="ri-wallet-3-fill"></i>
                    <span>₹0</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Migration Fee</div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
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
                  className="px-9 py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 hover:from-brand-800 hover:to-brand-600 shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Book Free Guided Demo</span>
                  <i className="ri-arrow-right-line text-lg group-hover:translate-x-1.5 transition-transform"></i>
                </button>

                <button
                  onClick={onContactSales}
                  className="px-7 py-4 rounded-full text-sm sm:text-base font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 shadow-sm transition-all"
                >
                  Contact Sales Team
                </button>
              </div>

            </div>

            {/* Right Column: Layered Community Visual Frame & Script Stamp */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Backing decorative frame */}
              <div className="relative w-full max-w-md">
                <div className="rounded-[32px] overflow-hidden border-2 border-slate-700/80 shadow-2xl relative aspect-[4/3] group">
                  <img
                    src="/assets/community_about.jpg"
                    alt="Smart Community Lifestyle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                        <i className="ri-building-line"></i>
                      </div>
                      <div>
                        <div className="font-bold text-white">Green Valley Residency</div>
                        <div className="text-[10px] text-slate-400">420 Flats • 100% Automated</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Hand-drawn Script Stamp */}
                <div className="absolute -bottom-8 -right-4 sm:-right-6 font-handwriting text-3xl sm:text-4xl text-white rotate-[-8deg] select-none pointer-events-none drop-shadow-lg flex items-center gap-1.5 font-bold">
                  <span>Smarter</span>
                  <span className="text-brand-400">Together</span>
                  <span className="text-brand-400 text-2xl">♥</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
