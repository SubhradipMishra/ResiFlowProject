import React from 'react';

interface FeaturesSectionProps {
  onSelectFeature?: (featureId: string) => void;
  onExploreAll?: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature, onExploreAll }) => {
  return (
    <section id="features" className="py-24 md:py-36 bg-[#F8FAFC] relative bg-dot-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              <span>CORE CAPABILITIES</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-3 text-faded-heading">
              Everything You Need in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500">
                One Operating System
              </span>
            </h2>

            <p className="mt-4 text-slate-600 text-base sm:text-lg text-faded-sub">
              Engineered for residential societies of every scale — from standalone luxury towers to multi-society township federations.
            </p>
          </div>

          <div>
            <button
              onClick={onExploreAll}
              className="px-7 py-3.5 rounded-full text-sm font-bold text-white bg-slate-950 hover:bg-brand-600 shadow-lg shadow-slate-950/15 hover:shadow-brand-500/25 transition-all duration-200 flex items-center gap-2 group whitespace-nowrap"
            >
              <span>Explore All Capabilities</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>

        {/* Asymmetric Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: 8-column wide Bento Hero: Visitor Management & Gate Pass */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('visitors')}
            className="lg:col-span-8 bento-card p-8 sm:p-10 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <i className="ri-user-shared-line"></i>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200/60">
                    ANPR & QR Gate System
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors pt-2">
                  Visitor Management & Express Passes
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Pre-approve guests, cabs, and deliveries in seconds. Security scans the dynamic QR code for instant, zero-touch boom barrier entry.
                </p>
              </div>

              {/* Mini Visual Simulation Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs font-mono w-full sm:w-56 shadow-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                  <span>GATE-01 TERMINAL</span>
                  <span className="text-emerald-400">● SYNCED</span>
                </div>
                <div className="text-[11px] text-slate-200">
                  <span className="text-brand-400">PASS:</span> SR-2026-A502
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  ✓ VERIFIED (Rahul Sharma)
                </div>
                <div className="text-[10px] text-slate-400">
                  Barrier opened: 0.4s
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
              <span>Interactive Simulator Ready</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>

          {/* Card 2: 4-column Bento: Maintenance & Invoicing */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('billing')}
            className="lg:col-span-4 bento-card p-8 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="ri-calculator-line"></i>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                  Zero Reconciliation
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                Automated Billing & Dues
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Automate monthly dues calculation, scheduled WhatsApp reminders, and digital GST invoices.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
              <span>Calculate Dues</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>

          {/* Card 3: 4-column Bento: Complaint Ticketing */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('complaints')}
            className="lg:col-span-4 bento-card p-8 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-600 border border-rose-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="ri-ticket-2-line"></i>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                  Strict SLAs
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                Complaint Management
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Raise maintenance tickets with photo uploads. Auto-assign society electricians, plumbers, and carpenters.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
              <span>Track Tickets</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>

          {/* Card 4: 4-column Bento: Amenity Scheduling */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('amenities')}
            className="lg:col-span-4 bento-card p-8 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="ri-calendar-event-line"></i>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  Live Scheduler
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                Amenity Slot Booking
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Reserve Clubhouse, Swimming Pool, Tennis Courts, and Party Hall slots with transparent time calendars.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
              <span>Reserve Slots</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>

          {/* Card 5: 4-column Bento: Announcements & Digital Notice Board */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('announcements')}
            className="lg:col-span-4 bento-card p-8 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="ri-megaphone-line"></i>
                </div>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200/60">
                  Instant Reach
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                Smart Notice Board
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Publish AGM circulars, water maintenance alerts, festival greetings, and official resident polls.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
              <span>Broadcast News</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
