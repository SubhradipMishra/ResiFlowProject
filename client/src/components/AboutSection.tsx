import React from 'react';

interface AboutSectionProps {
  onPayNow: () => void;
  onOpenDemo: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onPayNow, onOpenDemo }) => {
  return (
    <section id="about" className="py-24 md:py-36 bg-[#FAF9F6] relative overflow-hidden">
      {/* Single soft glow, kept subtle so it doesn't compete with the content */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-brand-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading, copy, metrics, CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              <span>About the platform</span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight leading-[1.08] text-slate-900">
              Building smarter <br />
              communities, together
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              ResiFlow is a next-generation community management platform engineered to eliminate society friction. From automated visitor gate passes to automated accounting reconciliation, we bring everything into one secure, real-time operating system.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="p-4 sm:p-5 text-center rounded-2xl border border-slate-200">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  100<span className="text-brand-600">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Societies
                </div>
              </div>

              <div className="p-4 sm:p-5 text-center rounded-2xl border border-slate-200">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  50K<span className="text-brand-600">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Residents
                </div>
              </div>

              <div className="p-4 sm:p-5 text-center rounded-2xl border border-slate-200">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  99.9<span className="text-brand-600">%</span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Uptime SLA
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenDemo}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-slate-950 hover:bg-brand-600 shadow-lg shadow-slate-900/15 hover:shadow-brand-500/25 transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Know more about architecture</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          {/* Right Column: Photo + live status card */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-lg mx-auto">

              <div className="rounded-[32px] overflow-hidden shadow-2xl shadow-slate-300/80 border-4 border-white aspect-[4/3] relative group">
                <img
                  src="/assets/community_about.jpg"
                  alt="Modern Residential Lifestyle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
              </div>

              {/* Floating status card — one clean surface instead of three stacked blurs */}
              <div className="absolute -bottom-10 -right-2 sm:-right-8 w-full max-w-[310px] sm:max-w-[340px] bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-xl z-20 animate-float-slow">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                    alt="Rahul Sharma"
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-brand-200/80"
                  />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Good morning,</div>
                    <div className="text-sm font-extrabold text-slate-900">Rahul Sharma</div>
                    <div className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-brand-200/60">
                      Flat A-502
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                        <i className="ri-receipt-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Maintenance due</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">₹2,500</span>
                      <button
                        onClick={onPayNow}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-lg text-[10px] transition-all hover:scale-105 active:scale-95"
                      >
                        Pay now
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <i className="ri-error-warning-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Open complaints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">1</span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px]">
                        In progress
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                        <i className="ri-user-shared-line text-xs font-bold"></i>
                      </div>
                      <span className="font-semibold text-slate-700">Visitors today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">2</span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px]">
                        Verified
                      </span>
                    </div>
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

export default AboutSection;