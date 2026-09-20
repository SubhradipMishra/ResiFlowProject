import React from 'react';

interface AboutSectionProps {
  onPayNow: () => void;
  onOpenDemo: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onPayNow, onOpenDemo }) => {
  return (
    <section id="about" className="py-24 md:py-36 bg-white relative overflow-hidden bg-dot-pattern">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big Faded Typography & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              <span>ABOUT THE PLATFORM</span>
            </div>

            {/* Big Faded Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight leading-[1.08] text-faded-heading">
              Building Smarter <br />
              Communities, <span className="text-brand-gradient">Together</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal text-faded-sub">
              ResiFlow is a next-generation community management platform engineered to eliminate society friction. From automated visitor gate passes to automated accounting reconciliation, we bring everything into one secure, real-time operating system.
            </p>

            {/* Uneven Metric Bento Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="bento-card p-4 sm:p-5 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  100<span className="text-brand-600">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Societies
                </div>
              </div>

              <div className="bento-card p-4 sm:p-5 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  50K<span className="text-brand-600">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Residents
                </div>
              </div>

              <div className="bento-card p-4 sm:p-5 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  99.9<span className="text-brand-600">%</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Uptime SLA
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenDemo}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-slate-950 hover:bg-brand-600 shadow-lg shadow-slate-900/15 hover:shadow-brand-500/25 transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Know More About Architecture</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          {/* Right Column: Layered Uneven Asymmetric Visual Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-lg mx-auto">
              
              {/* Backing decorative rotated card */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-brand-100/60 via-rose-50 to-sky-100/60 rounded-[36px] -rotate-2 -z-10 blur-sm"></div>

              {/* Main Community Photo Frame */}
              <div className="rounded-[32px] overflow-hidden shadow-2xl shadow-slate-300/80 border-4 border-white aspect-[4/3] relative group">
                <img
                  src="/assets/community_about.jpg"
                  alt="Modern Residential Lifestyle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
              </div>

              {/* Floating Live Resident Telemetry Card - Transparent Frosted Glass */}
              <div className="absolute -bottom-10 -right-2 sm:-right-8 w-full max-w-[310px] sm:max-w-[340px] bg-white/60 backdrop-blur-2xl border border-white/80 p-4 sm:p-5 rounded-3xl shadow-2xl z-20 animate-float-slow">
                {/* Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/50">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                    alt="Rahul Sharma"
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-brand-200/80 shadow-sm"
                  />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Good Morning,</div>
                    <div className="text-sm font-extrabold text-slate-900">Rahul Sharma</div>
                    <div className="text-[11px] font-bold text-brand-700 bg-rose-50/80 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-rose-200/50">
                      Flat A-502
                    </div>
                  </div>
                </div>

                {/* Status rows */}
                <div className="mt-3 space-y-2.5 text-xs">
                  {/* Maintenance */}
                  <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-brand-600 flex items-center justify-center">
                        <i className="ri-receipt-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Maintenance Due</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">₹2,500</span>
                      <button
                        onClick={onPayNow}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-lg text-[10px] shadow-sm shadow-brand-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>

                  {/* Complaints */}
                  <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
                        <i className="ri-error-warning-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Open Complaints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">1</span>
                      <span className="px-2.5 py-0.5 bg-slate-100/80 text-slate-700 font-bold rounded-lg text-[10px]">
                        In Progress
                      </span>
                    </div>
                  </div>

                  {/* Visitors */}
                  <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center">
                        <i className="ri-user-shared-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Visitors Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">2</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100/90 text-emerald-800 font-bold rounded-lg text-[10px]">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hand-drawn Script Stamp */}
              <div className="absolute -bottom-20 left-0 sm:left-4 font-handwriting text-2xl sm:text-3xl text-slate-900 rotate-[-6deg] select-none pointer-events-none drop-shadow-sm flex items-center gap-1.5 font-bold">
                <span>Your Society,</span>
                <span className="text-brand-600">Our Priority</span>
                <span className="text-brand-600 text-xl">♥</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
