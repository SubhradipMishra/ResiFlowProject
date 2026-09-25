import React from 'react';

interface FeaturesSectionProps {
  onSelectFeature?: (featureId: string) => void;
  onExploreAll?: () => void;
}

const FEATURES = [
  {
    id: 'billing',
    icon: 'ri-calculator-line',
    tag: 'Zero reconciliation',
    tagColor: 'bg-teal-900 text-white',
    title: 'Automated billing & dues',
    desc: 'Automate monthly dues calculation, scheduled WhatsApp reminders, and digital GST invoices.',
    cta: 'Calculate dues',
  },
  {
    id: 'complaints',
    icon: 'ri-ticket-2-line',
    tag: 'Strict SLAs',
    tagColor: 'bg-rose-600 text-white',
    title: 'Complaint management',
    desc: 'Raise maintenance tickets with photo uploads. Auto-assign society electricians, plumbers, and carpenters.',
    cta: 'Track tickets',
  },
  {
    id: 'amenities',
    icon: 'ri-calendar-event-line',
    tag: 'Live scheduler',
    tagColor: 'bg-amber-400 text-slate-900',
    title: 'Amenity slot booking',
    desc: 'Reserve clubhouse, swimming pool, tennis courts, and party hall slots with transparent time calendars.',
    cta: 'Reserve slots',
  },
  {
    id: 'announcements',
    icon: 'ri-megaphone-line',
    tag: 'Instant reach',
    tagColor: 'bg-slate-900 text-white',
    title: 'Smart notice board',
    desc: 'Publish AGM circulars, water maintenance alerts, festival greetings, and official resident polls.',
    cta: 'Broadcast news',
  },
];

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature, onExploreAll }) => {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#FAF9F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 text-xs font-bold text-slate-900 mb-5">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="tracking-wide">Core capabilities</span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight leading-[1.05] text-slate-900">
              One platform for every
              <br />
              part of running a society.
            </h2>

            <p className="mt-5 text-lg text-slate-600 max-w-lg leading-relaxed">
              Built for residential communities of every size — from a single tower to a multi-society township.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="px-8 py-4 rounded-full text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2 group whitespace-nowrap self-start md:self-auto"
          >
            <span>Explore all capabilities</span>
            <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Hero card: visitor management — flat ink card, dark terminal preview instead of soft-shadow bento */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('visitors')}
            className="lg:col-span-8 bg-white rounded-[28px] border-2 border-slate-900 p-8 sm:p-10 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-900 text-white border-2 border-slate-900 flex items-center justify-center text-2xl">
                    <i className="ri-user-shared-line"></i>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1.5 rounded-full border-2 border-slate-900 bg-white text-slate-900">
                    ANPR & QR gate system
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">
                  Visitor management & express passes
                </h3>

                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  Pre-approve guests, cabs, and deliveries in seconds. Security scans the dynamic QR code for instant, zero-touch boom barrier entry.
                </p>
              </div>

              {/* Terminal preview — flat, ink-bordered, no glow/shadow */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs font-mono w-full sm:w-56 border-2 border-slate-900 space-y-2 flex-shrink-0">
                <div className="flex justify-between text-slate-400 text-xs pb-2 border-b border-slate-700">
                  <span>GATE-01 TERMINAL</span>
                  <span className="text-emerald-400">● SYNCED</span>
                </div>
                <div className="text-xs text-slate-200">
                  <span className="text-rose-400">PASS:</span> SR-2026-A502
                </div>
                <div className="text-xs text-emerald-400 font-bold">
                  ✓ VERIFIED (Rahul Sharma)
                </div>
                <div className="text-xs text-slate-400">
                  Barrier opened: 0.4s
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t-2 border-slate-900/10 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>Interactive simulator ready</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
            </div>
          </div>

          {/* Billing — flat teal fill card */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('billing')}
            className="lg:col-span-4 bg-white rounded-[28px] border-2 border-slate-900 p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl border-2 border-slate-900 flex items-center justify-center text-2xl bg-teal-900 text-white">
                  <i className={FEATURES[0].icon}></i>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${FEATURES[0].tagColor}`}>
                  {FEATURES[0].tag}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">{FEATURES[0].title}</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{FEATURES[0].desc}</p>
            </div>

            <div className="mt-7 pt-4 border-t-2 border-slate-900/10 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>{FEATURES[0].cta}</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
            </div>
          </div>

          {/* Complaints — flat rose fill card */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('complaints')}
            className="lg:col-span-4 bg-white rounded-[28px] border-2 border-slate-900 p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl border-2 border-slate-900 flex items-center justify-center text-2xl bg-rose-600 text-white">
                  <i className={FEATURES[1].icon}></i>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${FEATURES[1].tagColor}`}>
                  {FEATURES[1].tag}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">{FEATURES[1].title}</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{FEATURES[1].desc}</p>
            </div>

            <div className="mt-7 pt-4 border-t-2 border-slate-900/10 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>{FEATURES[1].cta}</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
            </div>
          </div>

          {/* Amenities — flat amber fill card */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('amenities')}
            className="lg:col-span-4 bg-white rounded-[28px] border-2 border-slate-900 p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl border-2 border-slate-900 flex items-center justify-center text-2xl bg-amber-400 text-slate-900">
                  <i className={FEATURES[2].icon}></i>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${FEATURES[2].tagColor}`}>
                  {FEATURES[2].tag}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">{FEATURES[2].title}</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{FEATURES[2].desc}</p>
            </div>

            <div className="mt-7 pt-4 border-t-2 border-slate-900/10 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>{FEATURES[2].cta}</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
            </div>
          </div>

          {/* Announcements — flat ink fill card, spans full width to close the grid cleanly */}
          <div
            onClick={() => onSelectFeature && onSelectFeature('announcements')}
            className="lg:col-span-12 bg-slate-900 rounded-[28px] border-2 border-slate-900 p-8 sm:p-10 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-5 max-w-xl">
              <div className="w-12 h-12 rounded-xl border-2 border-white/30 flex items-center justify-center text-2xl bg-white/10 text-white flex-shrink-0">
                <i className={FEATURES[3].icon}></i>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-extrabold text-white">{FEATURES[3].title}</h3>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-400 text-slate-900">
                    {FEATURES[3].tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{FEATURES[3].desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-extrabold text-white whitespace-nowrap">
              <span>{FEATURES[3].cta}</span>
              <i className="ri-arrow-right-line group-hover:translate-x-1.5 transition-transform"></i>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;