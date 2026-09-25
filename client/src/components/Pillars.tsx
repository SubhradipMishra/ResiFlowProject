import React, { useState } from 'react';

interface PillarsProps {
  onSelectPillar?: (id: string) => void;
}

export const Pillars: React.FC<PillarsProps> = ({ onSelectPillar }) => {
  const [activePillar, setActivePillar] = useState<string>('residents');

  const pillars = [
    {
      id: 'residents',
      title: 'Residents',
      subtitle: 'Profiles & Approvals',
      description: 'Directory, dynamic tenant KYC & household management.',
      icon: 'ri-group-line',
      accent: 'from-rose-500/10 to-pink-500/5',
      iconColor: 'text-brand-600 bg-rose-50 border-rose-100',
      metric: '50K+ Active',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'societies',
      title: 'Multi-Societies',
      subtitle: 'Cluster Management',
      description: 'Single sign-on across multi-tower complexes.',
      icon: 'ri-building-line',
      accent: 'from-sky-500/10 to-blue-500/5',
      iconColor: 'text-sky-600 bg-sky-50 border-sky-100',
      metric: '100+ Complexes',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'security',
      title: 'Gate Security',
      subtitle: 'ANPR & Guard Patrol',
      description: 'Zero unauthorized entry with automated QR & OTP gates.',
      icon: 'ri-shield-keyhole-line',
      accent: 'from-brand-500/15 to-rose-500/5',
      iconColor: 'text-brand-700 bg-brand-50 border-brand-100',
      metric: '99.98% Accuracy',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'billing',
      title: 'Automated Billing & Dues',
      subtitle: 'Auto Invoicing & Receipts',
      description: 'One-click payments via UPI, Debit/Credit Cards & NetBanking with instant GST invoices.',
      icon: 'ri-wallet-3-line',
      accent: 'from-emerald-500/10 to-teal-500/5',
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      metric: '₹45Cr+ Processed',
      colSpan: 'lg:col-span-6',
    },
    {
      id: 'amenities',
      title: 'Clubhouse & Amenity Booking',
      subtitle: 'Smart Timetable Scheduler',
      description: 'Reserve Tennis, Gym, Banquet hall & Pool slots in real-time with zero scheduling conflicts.',
      icon: 'ri-calendar-event-line',
      accent: 'from-purple-500/10 to-indigo-500/5',
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      metric: '12K+ Monthly Bookings',
      colSpan: 'lg:col-span-6',
    },
  ];

  const handlePillarClick = (id: string) => {
    setActivePillar(id);
    if (onSelectPillar) {
      onSelectPillar(id);
    }
  };

  return (
    <section className="relative -mt-10 sm:-mt-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {pillars.map((item) => {
          const isSelected = activePillar === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handlePillarClick(item.id)}
              className={`${item.colSpan} bento-card p-6 sm:p-7 cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                isSelected ? 'ring-2 ring-brand-500/40 border-brand-300' : ''
              }`}
            >
              {/* Subtle background gradient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-transform duration-300 group-hover:scale-110 ${item.iconColor}`}
                  >
                    <i className={item.icon}></i>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-sm">
                    {item.metric}
                  </span>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {item.subtitle}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors mt-0.5">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom interactive action */}
              <div className="mt-5 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                <span>Explore Module</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pillars;
